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
var db = require("../../imp_services/impdb.js").connect();

var success = false;

router.route('/').post(function(req, res) {

    //var userDetails = JSON.parse(req.body.userdetails);

    /*
    var username = userDetails.username;
    var password = userDetails.password;
    var email = userDetails.email;
    var firstName = userDetails.firstName;
    var lastName = userDetails.lastName;
    var permID = userDetails.permID;
    */

    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var permID = req.body.permID;

    var salt = crypto.randomBytes(32).toString('base64');
    var hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex').toString('base64');

    var dateOutput = new Date();
    var date = dateOutput.getFullYear() + "-" + dateOutput.getMonth()+"-"+ (dateOutput.getDay() + 1);

    success = true;

    console.log("Creating user with:\nUsername: " + username + "\nEmail: " + email + "\nName: " + firstName + " " + lastName);
    //console.log("CALL CreateUser ('" + username + "', '" + hashedPassword + "', '" + email + "', '" + salt + "', '" + firstName + "', '" + lastName + "', '" + date + "')");
    if(typeof req.body.permID == 'undefined') {
        Q.fcall(db.beginTransaction())
            .then(db.query("USE " + db.databaseName))
            .then(db.query("CALL CreateUserAdmin ('" + username + "', '" + hashedPassword + "', '" + email + "', '" + salt + "', '" + firstName + "', '" + lastName + "', '" + date + "', '" + permID + "')"))
            .then(db.commit())
            .then(db.endTransaction())
            .catch(function (err) {
                console.log("Error: " + err);
                Q.fcall(db.rollback())
                    .then(db.endTransaction())
                    .done();
                res.status(503).send("ERROR: " + err);
            })
            .then(function () {
                //TODO Make this a promise chain
                require('../../imp_services/implogging')(req.cookies.IMPId, function (logService) {
                    logService.action.value = username;
                    logService.setType(800);
                    logService.store(function (err, results) {
                        if (err) {
                            res.status(500).send(err);
                        }
                        else {
                            SendConfirmation(email, function (err) {
                                if (err) {
                                    res.status(503).send("ERROR: " + err);
                                }
                                else {
                                    res.send("Success");
                                }
                            });
                        }
                    });
                });

            })
            .done();
    }
    else{
        console.log("Else hit in createUser");
        Q.fcall(db.beginTransaction())
            .then(db.query("USE " + db.databaseName))
            .then(db.query("CALL CreateUserAdmin ('" + username + "', '" + hashedPassword + "', '" + email + "', '" + salt + "', '" + firstName + "', '" + lastName + "', '" + date + "', '" + permID + "')"))
            .catch(function(err){
                console.log("Error: " + err);
                console.log("Error countered, About to rollback");
                success = false;
                Q.fcall(db.rollback()).catch(function(err) { console.log("oughto rollback failed " + err)})
                    .then(function() { db.endTransaction(); console.log("Well we ended the transaction")})
                    .done();
              res.status(409).send("ERROR: " + err).end();
            })
            .then(db.commit())
            .then(db.endTransaction())

            .then(function() {
                if (success) {
                    //TODO Make this a promise chain
                    require('../../imp_services/implogging')(req.cookies.IMPId, function (logService) {
                        logService.action.value = username;
                        logService.setType(800);
                        logService.store(function (err, results) {
                            if (err) {
                                res.status(500).send(err).end();
                            }
                            else {
                                SendConfirmation(email, password, function (err) {
                                    if (err) {
                                        res.status(503).send("ERROR: " + err).end();
                                    }
                                    else {
                                        res.send("Success").end();
                                    }
                                });
                            }
                        });
                    });
                }
               /* else
                {
                    res.status(503).send("ERROR: We could not commit the user, please check if this username is taken").end();
                } */

            }).catch(function(err) { console.log(err);})
            .done();
    }


});

//TODO, make this a promise chain
var SendConfirmation = function(email, password, callback){
    var lookup = "confirm-"+uuid.v4();
    impredis.set(lookup,"type","create", function(error, result){
        if (error !== null) {
            console.log("error: " + error);
            callback(error);
        }
        else {
            impredis.set(lookup, "email", email, function (error, result) {
                if (error !== null) {
                    console.log("error: " + error);
                    callback(error);
                }
                else {
                    console.log("Success");
                    impredis.setExpiration(lookup, 24);
                    sendEmail(email, lookup, password, function (err, data) {
                        callback(err, data);
                    })
                }
            });
        }
    });

};

var sendEmail = function(email, lookup, password, callback){
    var ses = new aws.SES({apiVersion: '2010-12-01', region:'us-west-2'});
    ses.sendEmail( {
            Source: 'nick@stevensis.com',
            Destination: { ToAddresses: [email] },
            Message: {
                Subject:{
                    Data: "Please confirm your account at "+config.app.frontend
                },
                Body: {
                    Text: {
                        Data: "Please visit "+config.app.frontend+"/"+lookup+" to confirm your email" + " your temporary password is " + password
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
