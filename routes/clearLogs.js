var express = require("express");
var router = express.Router();
var Q = require('q');


router.route("/").get(function(req,res){
    console.log("No Return");
    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CREATE TABLE IF NOT EXISTS userLogMap " +
        "(UserID int, LogID int, FOREIGN KEY (UserID) REFERENCES Users(UserID), FOREIGN KEY (LogID) REFERENCES Logs(LogID));"))

        .then(db.query("DELETE FROM userLogMap;"))
        .then(function(rows, columns){
            console.log("Log Clear Success");
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
