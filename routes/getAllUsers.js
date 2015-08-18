var express = require("express");
var router = express.Router();
var Q = require('q');


router.route("/").get(function(req,res){
    //Q.longStackSupport = true;
    console.log("getAllUsers called");
    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL GetAllUsers()"))
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction());
            console.log("Error:");
            console.error(err.stack);
            res.status(503).send("ERROR: " + err.code);
        })
        .then(function(rows, columns){
            //console.log("Success");
            var invUnit = JSON.stringify(rows[0][0]);
            console.log(invUnit);
            //console.log("invUnit: " + invUnit);
            res.send(invUnit);
        }).catch(function(err) {console.log(err) })
        .then(db.commit()).catch(function(err) {console.log(err) })
        .then(db.endTransaction()).catch(function(err) {console.log(err) })

        .done();
});

module.exports = router;