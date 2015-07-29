var express = require("express");
var Q = require('q');
var router = express.Router();
var config = require("konfig")();
var aws = require('aws-sdk');
var impredis = require("../../imp_services/impredis.js");




router.route('/:lookup').get(function(req, res) {
    impredis.get(req.params.lookup, function (error, val) {
        if (error !== null) {
            console.log("error: " + error);
            res.send("error: " + error);
        }
        else {
            console.log(val);
            confirmUser(val.email, val.username, function(err){
                if(err){
                    res.status(503).send("ERROR: " + err);
                }
                else{
                    res.json({username: val.username});
                    impredis.delete(req.params.lookup);
                }
            })
        }
    });
});

var confirmUser = function(email, username, callback){
    var db = require("../../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("UPDATE Users SET isConfirmed=1 WHERE username LIKE '"+username+"'"))
        .then(db.commit())
        .then(db.endTransaction())
        .then(function(){
            console.log("Success");
            sendThankYouEmail(email, function(err){
                if(err){
                    callback(err);
                }
                else{
                    callback(null);
                }
            });
        })
        .catch(function(err){
            console.log("Error: " + err);
            Q.fcall(db.rollback())
                .then(db.endTransaction())
                .done();
            callback(err);
        })
        .done();
};

var sendThankYouEmail = function(email, callback){
    var ses = new aws.SES({apiVersion: '2010-12-01', region:'us-west-2'});
    ses.sendEmail( {
            Source: 'nick@stevensis.com',
            Destination: { ToAddresses: [email] },
            Message: {
                Subject:{
                    Data: "Your account for "+config.app.frontend+" has been confirmed!"
                },
                Body: {
                    Text: {
                        Data: "Thank you for confirming your account!"
                    }
                }
            }
        }
        , function(err, data) {
            if(err){
                console.error("Error: "+err);
                callback(err);
            }
            else {
                console.log('Email sent:');
                console.log(data);
                callback(null);
            }
        });
};

module.exports = router;