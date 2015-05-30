var express = require("express");
var router = express.Router();
var Q = require('q');


router.route("/").get(function(req,res){
    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CREATE TABLE IF NOT EXISTS " + db.productTable + " " + db.productFields + ";"))
        .then(db.query("CREATE TABLE IF NOT EXISTS " + db.runTable + " " + db.runFields + ";"))
        .then(db.query("CREATE TABLE IF NOT EXISTS " + db.batchTable + " " + db.batchFields + ";"))
        .then(db.query("SELECT * FROM "
            + db.batchTable + " NATURAL JOIN "
            + db.runTable   + " NATURAL JOIN "
            + db.productTable + " "
        + "GROUP BY " + " ProductID, " + "RunID;"))
        .then(function(rows, columns){
            console.log("Success");
            var invUnit = JSON.stringify(rows[0]);
            res.send(invUnit);
            db.endTransaction();
        })
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
