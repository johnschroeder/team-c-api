var express = require("express");
var router = express.Router();
var Q = require('q');


router.route("/:productID").get(function(req,res){
    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    /*Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query(
            "SELECT " + db.runTable +".ProductID, " + db.productTable + ".Name, SUM(" + db.batchTable + ".amount) AS total, MAX(" + db.runTable + ".date) AS mostRecent "
            + "FROM " + db.runTable + " "
            + "JOIN " + db.productTable + " on " + db.runTable + ".ProductID = " + db.productTable + ".ProductID "
            + "JOIN " + db.batchTable + " on " + db.batchTable + ".RunID = " + db.runTable + ".RunID "
            + "WHERE " + db.runTable + ".ProductID = " + req.params.productID))
*/

    var queryArray = ["USE " + db.databaseName,
        "SELECT " + db.runTable +".ProductID, " + db.productTable + ".Name, SUM(" + db.batchTable + ".amount) AS total, MAX(" + db.runTable + ".date) AS mostRecent "
    + "FROM " + db.runTable + " "
    + "JOIN " + db.productTable + " on " + db.runTable + ".ProductID = " + db.productTable + ".ProductID "
    + "JOIN " + db.batchTable + " on " + db.batchTable + ".RunID = " + db.runTable + ".RunID "
    + "WHERE " + db.runTable + ".ProductID = " + req.params.productID];
    db.query(queryArray)
        .then(function(result){
            console.log("Success");
            var invUnit = JSON.stringify(result.rows[0]);
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
