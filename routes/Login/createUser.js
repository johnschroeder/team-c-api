var express = require("express");
var Q = require('q');
var router = express.Router();
var crypto = require('crypto');
var redis = require('redis');
var config = require("konfig")();
var uuid = require('node-uuid');
var aws = require('aws-sdk');

var port=config.app.redis.port;
var host=config.app.redis.host;


/*
 Usage:
 POST Request
 www.thisisimp.com/api/createUser/
 Body:
 {
    "username":String,
    "password":String,
    "email":String,
    "firstName":String,
    "lastName":String,
 }
 */


router.route("/").post(function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;

    var salt = crypto.randomBytes(32).toString('base64');
    var hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex').toString('base64');
    var db = require("../../imp_services/impdb.js").connect();
    var dateOutput = new Date();
    var date = dateOutput.getMonth()+"-"+dateOutput.getDay()+"-"+dateOutput.getFullYear();

    console.log("Creating user with:\nUsername: " + username + "\nEmail: " + email + "\nName: " + firstName + " " + lastName);

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL CreateUser ('" + username + "', '" + hashedPassword + "', '" + email + "', '" + salt + "', '" + firstName + "', '" + lastName + "', '" + date + "')"))
        .then(db.commit())
        .then(db.endTransaction())
        .then(function() {

           /* var logsService = require('../../imp_services/displayLogs');
            var actionData = {"value" : username };
            var actionDataString = JSON.stringify(actionData).replace(/"/g, '\\\\"');
            logsService.addLog(800, username, actionDataString, function success(message) {
                console.log(message);
            });
            */

            console.log("Success");

            SendConfirmation(email, function (err) {
                if (err) {
                    res.status(503).send("ERROR: " + err);
                }
                else {
                    res.send("Success");
                }
            });

        })
        .catch(function(err){
            console.log("Error: " + err);
            Q.fcall(db.rollback())
                .then(db.endTransaction())
                .done();

            res.status(503).send("ERROR: " + err);
        })
        .done();


});

var SendConfirmation = function(email, callback){
    var ses = new aws.SES({apiVersion: '2010-12-01', region:'us-west-2'});
    var lookup = uuid.v4();
    var client = redis.createClient(port,host);
    console.log("test");
    client.hmset(lookup,"type","create","email" ,email,function (error, result) {
        if (error !== null) {
            console.log("error: " + error);
            client.quit();
            callback(error);
        }
        else {
            console.log("Success");
            ses.sendEmail( {
                    Source: 'nick@stevensis.com',
                    Destination: { ToAddresses: [email] },
                    Message: {
                        Subject:{
                            Data: "Please confirm your account at "+config.app.frontend
                        },
                        Body: {
                            Text: {
                                Data: "Please visit "+config.app.frontend+"/lookup/"+lookup+" to confirm your email"
                            }
                        }
                    }
                }
                , function(err, data) {
                    if(err){
                        console.error("Error: "+err);
                        client.quit();
                        callback(err);
                    }
                    else {
                        console.log('Email sent:');
                        console.log(data);
                        client.quit();
                        callback(null);
                    }
                });
        }
    });
};

module.exports = router;