var express = require("express");
var router = express.Router();
var Q = require("q");

router.route('/:username/:firstName/:lastName/:perms/:requestDelete').get(function(req,res) {

    var username = req.params.username;
    var firstName = req.params.firstName;
    var lastName = req.params.lastName;
    var perms = req.params.perms;
    var requestDelete = req.params.requestDelete;



    var db = require("../imp_services/impdb.js").connect();
    var args = username + "," +
        "" + firstName+ "," +
        "" + lastName+ "," +
         + parseInt(perms) + "," +
         + parseInt(requestDelete);
console.log(args);
    Q.fcall(db.beginTransaction())

        .then(db.query("USE " + db.databaseName))
         .then(db.query("CALL EditUserByUsername(" + args + ");"))
        .then(function (rows) {
            if (rows[0].affectedRows != 1) {
                res.end("Update Failed!");
            }
            else {
                res.end("Update Complete!");
            }
        })
        .then(db.commit())
        .then(db.endTransaction())
        .catch(function (err) {
            Q.fcall(db.rollback())
                .then(db.endTransaction());
            console.log("We had an error");
            console.log("Error: " + err);
        })
        .done();
});

module.exports = router;