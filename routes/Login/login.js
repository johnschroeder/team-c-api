var express = require("express");
var router = express.Router();
var Q = require('q');
var crypto = require('crypto');
var uuid = require('node-uuid');
var impredis = require("../../imp_services/impredis.js");

router.route('/').post( function(req,res){

    var username=req.body.user;
    var password=req.body.password;

    var successLog = false;

    var db = require("../../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL GetUserByUsername(\'" + username + "\');"))
        .then(function(row) {

           // We got data about the user
            if (row[0][0].length == 0) { // No user by that username
                res.end("Invalid Credentials!");
            }
            else {
            var oldhash = row[0][0][0].HP;
                var salt = row[0][0][0].US;
                var hash = crypto.createHash('sha256').update(password + salt).digest('hex');

                if (hash == oldhash) {
                    var cookie = uuid.v4();
                    console.log("Hash match!");
                    res.cookie('IMPId', cookie, {secure: false, maxAge: 24* 60 * 60 * 1000, httpOnly: false});
                    res.send(cookie);
                    impredis.set(cookie, "username", username, function(error, result){
                        if(error){
                            res.status(500).send("ERROR: "+error);
                        }
                        else {
                            impredis.set(cookie, "IMPperm", row[0][0][0].PermsID, function(error, result)
                            {
                                if(error) {
                                    res.status(500).send("ERROR: " + error);
                                }
                                else{
                                    successLog = true;
                                    res.end(cookie);
                                }
                            });
                        }

                    });
                    impredis.setExpiration(cookie, 24);
                }
                else {
                    console.log("Hash does not match!");
                    res.end("Invalid Credentials!");
                }
            }
        })
        .then(db.commit())
        .then(db.endTransaction())
        .then(function() {
            if (successLog) {
                require('../../imp_services/implogging')(req.cookies.IMPId, function (logService) {
                    logService.action.user = req.body.user;
                    logService.setType(900);
                    logService.store(function (err, results) {
                        if (err) res.status(500).send(err);
                    });
                });
            }

        }).catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction())
                .then(console.log("We had an error") )
                .done();
            console.log("Error: " + err);
            res.status(503).send("ERROR: " + err);
        })
        .done();

});

module.exports = router;
