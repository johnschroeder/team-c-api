var express = require("express");
var Q = require('q');
var router = express.Router();
var redis = require('redis');
var config = require("konfig")();
var uuid = require('node-uuid');
var aws = require('aws-sdk');


var port=config.app.redis.port;
var host=config.app.redis.host;



/*
 Usage:
 www.thisisimp.com/login/startpasswordreset/
 Body contains:
 email: String
 */

router.route('/').post(function(req, res) {
    var ses = new aws.SES({apiVersion: '2010-12-01', region:'us-west-2'});
    var email = req.body.email;
    var lookup = uuid.v4();
    var client = redis.createClient(port,host);
    client.hmset(lookup,"type","reset","email" ,email,function (error, result) {
        if (error !== null) {
            console.log("error: " + error);
            res.status(500).send("error: " + error);
        }
        else {
            console.log("Success");
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
                    client.quit();
                    res.status(500).send(err);
                }
                else {
                    console.log('Email sent:');
                    console.log(data);
                    client.quit();
                    res.end();
                }
            });
        }
    });
});

module.exports = router;