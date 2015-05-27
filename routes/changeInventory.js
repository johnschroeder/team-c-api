var mysql = require("mysql");
var config = require("konfig")();

var express = require("express");

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
    var mode = req.params.mode;
    var databaseName = "imp_db";

    var productTable = "Products";
    var productFields = "(ProductID, Name, Customer, Description, DateCreated)";

    var runTable = "Runs";
    var runFields = "(RunID, ProductID, Date)";

    var batchTable = "Batches";
    var batchFields = "(RunID, Amount, Location)";

    var connection = mysql.createConnection({
        host: config.app.mysql.host,
        user: config.app.mysql.user,
        password: config.app.mysql.password
    });

    var queryFunction = function(queryInput, nextQueryFunction) {
        return function() {
            connection.query(queryInput, function(err, result) {
                if (err) {
                    connection.rollback(function() {
                        console.error(err.stack);
                        res.status(503).send("Query Error: " + err.code);
                    });
                } else {
                    if (nextQueryFunction)
                        nextQueryFunction();
                    else {
                        connection.commit(function(err) {
                            if (err) {
                                console.error(err.stack);
                                res.status(503).send("Commit Error: " + err.code);
                            } else {
                                res.send("Success!");
                                connection.end();
                            }
                        });
                    }
                }
            });
        };
    };

    var queryToExecute = function() {
        connection.commit(function(err) {
            if (err) {
                console.error(err.stack);
                res.status(503).send("Commit Error: " + err.code);
            } else {
                res.status(503).send("Error: Mode not recognized");
                connection.end();
            }
        });
    };

    switch (mode) {
        case "addRun":
            queryToExecute = queryFunction("USE " + databaseName,
                queryFunction("INSERT INTO " + runTable + " Values " + "(NULL, " + req.params.inventoryId + ", " + req.params.runDate + ") ")
            );
            break;
        case "removeRun":
            console.error("runID: " + req.params.runId);
            queryToExecute = queryFunction("USE " + databaseName,
                queryFunction("DELETE from " + runTable  + " WHERE RunId = " + req.params.runId)
            );
            break;
        case "addBatch":
            queryToExecute = queryFunction("USE " + databaseName,
                queryFunction("INSERT INTO " + batchTable + " Values " + "(" + req.params.runId + ", " + req.params.batchAmount + ", " + req.params.batchLocation + ")")
            );
            break;
        case "removeBatch":
            queryToExecute = queryFunction("USE " + databaseName,
                queryFunction("DELETE from " + batchTable +
                    " WHERE RunID = " + req.params.runId + " AND Amount = " + req.params.batchAmount + " AND Location = " + req.params.batchLocation +
                        " Order BY Amount ASC" +
                            " limit 1"));
            break;
        default:
            break;
    }

    connection.connect(function(err) {
        if (err) {
            console.error(err.stack);
            res.status(503).send("Connection Error: " + err.code);
        } else {
            connection.beginTransaction(function(err) {
                if (err) {
                    console.error(err.stack);
                    res.status(503).send("Begin Transaction Error: " + err.code);
                } else {
                    queryToExecute();
                }
            });
        }
    });
}

module.exports = router;