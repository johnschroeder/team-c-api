var express = require("express");
var router = express.Router();
var Q = require('q');


router.route("/:after").get(function(req,res){

    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    var after = req.params.after;
    console.log("after date " + after);
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CREATE TABLE IF NOT EXISTS " + db.logsTable + " " + db.logFields + ";"))

        .then(db.query("SELECT l.LogType, l.date, b.amount, p.name, l.customerID, u.name AS UserName, l.logID" +
        " FROM logs l JOIN Products p ON p.productID = l.productID JOIN customers c ON c.CustomerID = l.CustomerID" +
    " JOIN batches b JOIN Users u on u.UserID = l.UserID" +
    " JOIN userLogMap on l.logID = userLogMap.LogID WHERE userLogMap.UserID = 201 AND l.date > " + after + " ;"))
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
