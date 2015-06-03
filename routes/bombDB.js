var express = require("express");
var router = express.Router();
var Q = require('q');

  /** BEFORE CHANGING ANYTHING HERE, MAKE SURE YOU UNDERSTAND THE RAMIFICATIONS!
 * THIS ROUTE DROPS THE SHARED DATABASE AND REPLACES IT WITH WHATEVER THE
 * SQL SCRIPT TELLS IT TO
  */
router.route("/:selectedID").get(function(req,res){
//    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    var selectedID  = req.params.selectedID;
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CREATE TABLE IF NOT EXISTS " + db.productTable + " " + db.productFields + ";"))
        .then(db.query("SELECT * FROM "
        + db.productTable + " "
        + "WHERE " +selectedID + " = ProductID; "))
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
