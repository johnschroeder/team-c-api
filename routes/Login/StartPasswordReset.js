var express = require("express");
var Q = require('q');
var router = express.Router();
var config = require("konfig")();
var uuid = require('node-uuid');
var aws = require('aws-sdk');



/*
 Usage:
 www.thisisimp.com/login/startpasswordreset/
 Body contains:
 email: String
 */

//TODO make this a promise chain
router.route('/').post(function(req, res) {
    var impredis = require("../../imp_services/impredis.js");
    var email = req.body.email;
    var lookup = uuid.v4();
    impredis.set(lookup,"type","reset", function(error, result){
        if (error !== null) {
            console.log("error: " + error);
            res.status(500).send("error: " + error);
        }
        else{
            impredis.set(lookup, "email" ,email,function (error, result) {
                if (error !== null) {
                    console.log("error: " + error);
                    res.status(500).send("error: " + error);
                }
                else {
                    console.log("Success");
                    sendEmail(email, lookup, function(err, result){
                        if(err){
                            res.status(500).send(err);
                        }
                        else{
                            res.end();
                        }
                    });
                }
            });
        }
    });
});

var sendEmail = function(email, lookup, callback){
    var ses = new aws.SES({apiVersion: '2010-12-01', region:'us-west-2'});
    // NOTE: To change the Source email, you must first register a new one with AWS SES
    ses.sendEmail( {
            Source: 'nick@stevensis.com',
            Destination: { ToAddresses: [email] },
            Message: {
                Subject:{
                    Data: "Password Reset for "+config.app.frontend
                },
                Body: {
                    Text: {
                        Data: "Please visit "+config.app.frontend+"/lookup/"+lookup+" to reset your password"
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
