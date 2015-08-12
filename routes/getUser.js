var express = require("express");
var router = express.Router();
var Q = require("q");

router.route('/:username').get(function(req,res) {

    var username = req.params.username;

    var db = require("../imp_services/impdb.js").connect();

    Q.fcall(db.beginTransaction())

        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL GetUserByUsername(\'" + username+ "\');"))
        .then(function (rows) {

            var user = rows[0][0][0];
            var jsonObject = {"firstName":user.FirstName, "lastName":user.LastName, "permsId":user.PermsID};
            res.end(JSON.stringify(jsonObject));

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