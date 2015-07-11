var express = require("express");
var router = express.Router();
var Q = require("q");

router.route('/:username/:firstName/:lastName/:perms:/isConfirmed').get(function(req,res) {

    var username = req.params.username;
    var firstName = req.params.firstName;
    var lastName = req.params.lastName;
    var perms = req.params.perms;
    var isConfirmed = req.params.isConfirmed;

    var db = require("../imp_services/impdb.js").connect();

    Q.fcall(db.beginTransaction())

        .then(db.query("USE " + db.databaseName))
        /* .then(db.query("CALL EditUserByUsername(" +
            "\'" + username+ "\' + " +
            "\'" + firstName+ "\' +  " +
            "\'" + lastName+ "\'" +
            "\'" + perms + "\'" +
            "\'" + isConfirmed + "\'" +

            ");"))
        .then(function (rows) {
                //Some check condition?
            */
        .then (res.end("Update Complete!"))
    /*
            //or
            //res.end("Could not update!");

        })
        */
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