var express = require("express");
var router = express.Router();
var Q = require('q');


router.route("/").get(function(req,res){

    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CREATE TABLE IF NOT EXISTS " + db.logsTable + " " + db.logFields + ";"))

        .then(db.query("SELECT l.LogType, l.date, b.amount, p.name, l.customerID, u.name AS UserName" +
        " FROM logs l JOIN Products p ON p.productID = l.productID JOIN customers c ON c.CustomerID = l.CustomerID" +
    " JOIN batches b ON runID JOIN Users u on u.UserID = l.UserID" +
    " JOIN userLogMap on l.logID = userLogMap.LogID AND userLogMap.UserID = 201"))
        .then(function(rows, columns){
            console.log("Log Select Success");
            var logUnit = JSON.stringify(rows[0]);
            res.send(logUnit);
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
