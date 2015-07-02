var express = require("express");
var Q = require('q');
var router = express.Router();
var redis = require('redis');
var config = require("konfig")();
var aws = require('aws-sdk');

var port=config.app.redis.port;
var host=config.app.redis.host;




router.route('/:lookup').get(function(req, res) {
    var client = redis.createClient(port,host);
    client.hgetall(req.params.lookup, function (error, val) {
        if (error !== null) {
            console.log("error: " + error);
            client.quit();
            res.send("error: " + error);
        }
        else {
            console.log(val);
            confirmUser(val.email, function(err){
                if(err){
                    client.quit();
                    res.status(503).send("ERROR: " + err);
                }
                else{
                    client.del(req.params.lookup);
                    client.quit();
                    res.send("success!");
                }
            })
        }
    });
});

var confirmUser = function(email, callback){
    var db = require("../../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("UPDATE Users SET isConfirmed=1 WHERE email LIKE '"+email+"'"))
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
}

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