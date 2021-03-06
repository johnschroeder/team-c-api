var express = require("express");
var Q = require('q');
var router = express.Router();


/*
 Usage:
 localhost:50001/Logging/AddLogViewMapEntry/Username/LogID
 */

router.route("/:logId").get(function(req, res) {
    var db = require("../../imp_services/impdb.js").connect();

    //Q.longStackSupport = true;   // for error checking
    require("../../imp_services/impredis.js").get(req.cookies.IMPId, function usernameReturn(error, val) {
        var username = val.username;

        Q.fcall(db.beginTransaction())
            .then(db.query("USE " + db.databaseName))
            .then(db.query("CALL AddLogViewMapEntry ('" + username + "', " + req.params.logId + ")"))
            .then(function (rows) {
                var queryResult = JSON.stringify(rows[0][0]);
                console.log("Attempt to add entry to LogViewMap - Query result:   " + queryResult);
                res.send(queryResult);
            })
            .then(db.commit())
            .then(db.endTransaction())

            .catch(function (err) {
                Q.fcall(db.rollback())
                    .then(db.endTransaction())
                    .done();
                console.log("Error: " + err);
                //console.error(err.stack);
                res.status(503).send("ERROR: " + err);
            })
            .done();
    });
});

module.exports = router;