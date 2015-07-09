var express = require("express");
var router = express.Router();
var Q = require('q');


router.route("/:fragment").get(function(req,res){

    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query(
            "SELECT Name as label FROM Customers where Name like '%" + req.params.fragment + "%'" ))
        .then(function(rows){
            console.log("Success");
            var invUnit = JSON.stringify(rows[0]);
            res.send(invUnit);
        })
        .then(db.commit())
        .then(db.endTransaction())
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction());
            console.log("Error:");
            console.error(err.stack);
            res.status(503).send("ERROR: " + err.code);
        })
        .done();
});

module.exports = router;
