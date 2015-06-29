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
    "username":String,
    "password":String,
    "email":String,
    "firstName":String,
    "lastName":String,
 }
 */

router.route("/").post(function(req, res) {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;

    var salt = crypto.randomBytes(32).toString('base64');
    var hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex').toString('base64');
    var db = require("../../imp_services/impdb.js").connect();

    console.log("CALL CreateUser (" + username + ", " + hashedPassword + ", '" + email + "', '" + salt + "', '" + firstName + "', '" + lastName + "', '" + Date.now() + "')");

    /*Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL CreateUser (" + username + ", " + hashedPassword + ", '" + email + "', '" + salt + "', '" + firstName + "', '" + lastName + "', '" + Date.now() + "')"))
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
        .done();*/


});

module.exports = router;