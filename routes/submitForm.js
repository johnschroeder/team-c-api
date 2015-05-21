var mysql = require("mysql");
var config = require("konfig")();
var express = require("express");
var router = express.Router();

/*
Usage:
    localhost:50001/submitForm/jobID/Description/employeeName
*/

router.route("/:jobID/:Description/:employeeName").get(function(req, res) {
    var databaseName = "impDB";

    var tableName = "Entry";
    var tableFields = "(jobID int, Description TEXT, employeeName TINYTEXT)";

    var id = req.params.jobID;
    var desc = req.params.Description;
    var name = req.params.employeeName;
    var values = "(" + parseInt(id) + ", " + mysql.escape(desc) + ", " + mysql.escape(name) + ")";
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

    var queryToExecute = queryFunction("USE " + databaseName,
        queryFunction("CREATE TABLE IF NOT EXISTS " + tableName + " " + tableFields,
            queryFunction("INSERT INTO " + tableName + " VALUES " + values)
        )
    );


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
});

module.exports = router;
