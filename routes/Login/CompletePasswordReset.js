var express = require("express");
var Q = require('q');
var router = express.Router();
var crypto = require('crypto');


/*
 Usage:
 POST Request
 www.thisisimp.com/api/createUser/
 Body:
 {
 "password":String,
 "email":String
 }
 */

router.route("/").post(function(req, res) {
    var password = req.body.password;
    var email = req.body.email;

    var salt = crypto.randomBytes(32).toString('base64');
    var hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex').toString('base64');
    var db = require("../../imp_services/impdb.js").connect();
    var date = Date.now();

    console.log("Resetting password for user with email: " + email);

    console.log("\n\nDEBUG INFO:\nHashed Password: "+hashedPassword+"\nSalt: "+salt);

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL ResetPassword (" + email + "', '" + hashedPassword + "', '"+ salt +")"))
        .then(db.commit())
        .then(db.endTransaction())
        .then(function(){
            console.log("Success");
            res.send("Success");
        })

        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction())
                .done();
            console.log("Error: " + err);
            res.status(503).send("ERROR: " + err);
        })
        .done();


});

module.exports = router;