var express = require("express");
var Q = require('q');
var router = express.Router();
var crypto = require('crypto');
var config = require("konfig")();
var uuid = require('node-uuid');
var aws = require('aws-sdk');
var impredis = require("../../imp_services/impredis.js");


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
        .then(function(){
            console.log("Success");
            SendConfirmation(email, function(err){
                if(err){
                    res.status(503).send("ERROR: " + err);
                }
                else{
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

//TODO, make this a promise chain
var SendConfirmation = function(email, callback){
    impredis.set(lookup,"type","create", function(error, result){
        if (error !== null) {
            console.log("error: " + error);
            callback(error);
        }
        else {
            impredis.set("email", email, function (error, result) {
                if (error !== null) {
                    console.log("error: " + error);
                    callback(error);
                }
                else {
                    console.log("Success");
                    impredis.setExpiration(lookup, 24);
                    sendEmail(email, function (err, data) {
                        callback(err, data);
                    })
                }
            });
        }
    });

};

var sendEmail = function(email, callback){
    var ses = new aws.SES({apiVersion: '2010-12-01', region:'us-west-2'});
    var lookup = uuid.v4();
    ses.sendEmail( {
            Source: 'nick@stevensis.com',
            Destination: { ToAddresses: [email] },
            Message: {
                Subject:{
                    Data: "Please confirm your account at "+config.app.frontend
                },
                Body: {
                    Text: {
                        Data: "Please visit "+config.app.frontend+"/"+lookup+" to confirm your email"
                    }
                }
            }
        }
        , function(err, data) {
            if(err){
                console.error("Error: "+err);
                callback(err, null);
            }
            else {
                console.log('Email sent:');
                console.log(data);
                callback(null, data);
            }
        });
};

module.exports = router;