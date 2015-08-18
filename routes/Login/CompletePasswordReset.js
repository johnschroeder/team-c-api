var express = require("express");
var Q = require('q');
var router = express.Router();
var crypto = require('crypto');
var impredis = require("../../imp_services/impredis.js");


/*
 Usage:
 POST Request
 www.thisisimp.com/api/createUser/
 Body:
 {
 "password":String,
 "lookup":String
 }
 */

router.route("/").post(function(req, res) {
    var password = req.body.password;
    var lookup = req.body.lookup;

    impredis.get(lookup, function(err, result){
        if(result){
            console.log(result)
            var username = result.username;
            var salt = crypto.randomBytes(32).toString('base64');
            var hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex').toString('base64');
            var db = require("../../imp_services/impdb.js").connect();
            var date = Date.now();

            console.log("Resetting password for user: " + username);

            console.log("\n\nDEBUG INFO:\nHashed Password: " + hashedPassword + "\nSalt: " + salt);

            Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("CALL ResetPassword ('" + username + "', '" + hashedPassword + "', '" + salt + "')"))
                .then(db.commit())
                .then(db.endTransaction())
                .then(function () {
                    console.log("Success");
                    client.del(lookup);
                    res.end();
                })
                .catch(function (err) {
                    console.log("Error: " + err);
                    Q.fcall(db.rollback())
                        .then(db.endTransaction())
                        .done();

                    res.status(503).send("ERROR: " + err);
                })
                .done();
        }
        else{
            res.status(500).send("Lookup not found");
        }
    });


});

module.exports = router;