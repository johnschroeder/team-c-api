var express = require("express");
var Q = require('q');
var router = express.Router();
var redis = require('redis');
var config = require("konfig")();
var uuid = require('node-uuid');
var aws = require('aws-sdk');


var port=config.app.redis.port;
var host=config.app.redis.host;

var client = redis.createClient(port,host);

/*
 Usage:
 www.thisisimp.com/login/startpasswordreset/:email
 */

router.route('/:email').get(function(req, res) {
    var ses = new aws.SES({apiVersion: '2010-12-01'});

    var lookup = uuid.v4();

    client.set(lookup, req.params.email, function (error, result) {
        if (error !== null) {
            console.log("error: " + error);
            res.send("error: " + error);
        }
        else {
            console.log("Success");
            ses.sendEmail( {
                Source: 'nick@stevensis.com',
                Destination: { ToAddresses: req.params.email },
                Message: {
                    Subject:{
                        Data: "Password Reset for "+config.app.frontend
                    },
                    Body: {
                        Text: {
                            Data: "Please visit "+config.app.frontend+"/"+lookup+" to reset your password"
                        }
                    }
                }
            }
            , function(err, data) {
                if(err){
                    console.error("Error: "+err);
                }
                else {
                    console.log('Email sent:');
                    console.log(data);
                }
            });
            res.send("Success");
        }
    });
});

module.exports = router;