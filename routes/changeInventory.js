var express = require("express");
var Q = require('q');

var router = express.Router();


/*
 Usage:
 addRun - localhost:50001/addRun/inventoryId/runDate
 removeRun - localhost:50001/removeRun/inventoryId/runId
 addBatch - localhost:50001/addBatch/runId/batchAmount/batchLocation
 removeBatch - localhost:50001/removeBatch/runId/batchAmount/batchLocation
 Fields:
 inventoryId, runId, runDate, batchAmount, batchLocation
 */

// add run
router.route("/:mode/:inventoryId/:runDate").get(function(req, res) {
    changeInventory(req, res);
});

// remove run
router.route("/:mode/:runId").get(function(req, res) {
    changeInventory(req, res);
});

// add and remove batch
router.route("/:mode/:runId/:batchAmount/:batchLocation").get(function(req, res) {
    changeInventory(req, res);
});


function changeInventory(req, res) {
    var db = require("../imp_services/impdb.js").connect();
    var mode = req.params.mode;
    var promise;

    //Q.longStackSupport = true;   // for error checking

    switch (mode) {
        case "addRun":
            promise = Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("INSERT INTO " + db.runTable + " Values " + "(NULL, " + req.params.inventoryId + ", " + req.params.runDate + ") "));

            break;
        case "removeRun":
            promise = Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("DELETE from " + db.runTable  + " WHERE RunId = " + req.params.runId))

            .then(function(rows) {
                    // check if database changed
                    var deferred = Q.defer();
                    if (rows[0].affectedRows == 0) {
                        deferred.reject("Trying to remove run that doesn't exist");
                    } else {
                        deferred.resolve();
                    }
                    return deferred.promise;
                //console.log(columns);
                //var invUnit = JSON.stringify(rows[0]);
                //res.send(invUnit);
                //db.endTransaction();
            });

            break;
        case "addBatch":
            promise = Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("INSERT INTO " + db.batchTable + " Values " + "(" + req.params.runId + ", " + req.params.batchAmount + ", " + req.params.batchLocation + ")"));

            break;
        case "removeBatch":
            promise = Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("DELETE from " + db.batchTable +
                    " WHERE RunID = " + req.params.runId + " AND Amount = " + req.params.batchAmount + " AND Location = " + req.params.batchLocation +
                        " Order BY Amount ASC" +
                            " limit 1"));

            break;
        default:
            break;
    }

    promise
        .then(db.commit())
        .then(db.endTransaction())
        .then(function(){
            console.log("Success");
            res.send("Success");
        })

        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction())
                .done();
            console.log("Error: " + err);
            //console.error(err.stack);
            res.status(503).send("ERROR: " + err);
        })
        .done();
}

module.exports = router;