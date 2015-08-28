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
 username: String
 */

router.route('/').post(function(req, res) {
    var impredis = require("../../imp_services/impredis.js");
    var username = req.body.username;
    var lookup = uuid.v4();

    // Get username's email
    var db = require("../../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL GetUserByUsername('"+username+"');"
        ))
        .then(function(rows, columns){
            var deferred = Q.defer();
            impredis.set(lookup,"type","reset", function(error, result){
                if (error !== null) {
                    deferred.reject(error);
                }
                else{
                    impredis.set(lookup, "username" , username, function (error, result) {
                        if (error !== null) {
                            deferred.reject(error);
                        }
                        else {
                            console.log("Success");
                            sendEmail(rows[0][0][0].Email, lookup, function(err, result){
                                if(err){
                                    deferred.reject(err);
                                }
                                else{
                                    res.end();
                                    deferred.resolve();
                                }
                            });
                        }
                    });
                }
            });
            return deferred.promise;
        })
        .then(db.commit())
        .then(db.endTransaction())
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction())
                .done();
            console.log("Error:");
            console.error(err.stack);
            res.status(503).send("ERROR: " + err.code);

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
                        Data: "Please visit "+config.app.frontend+"/confirm-"+lookup+" to reset your password"
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
