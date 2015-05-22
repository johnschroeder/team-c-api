 var mysql = require("mysql");
 var config = require("konfig")();
 var express = require("express");
 var router = express.Router();
 /* Is there a way to do this without the relative path? */
 var db = require("../imp_modules/impdb.js");

 /*
 Usage:
 localhost:50001/ProductID/Name/Customer/Description/DateCreated
 */
router.route("/:productID/:productName/:customer/:description/:date").get(function(req, res) {
    var databaseName = db.databaseName;

    var tableName = db.productTable;
    var tableFields = db.prodFields;

    var id = req.params.productID;
    var productName = req.params.productName;
    var customer = req.params.customer;
    var description = req.params.description;
    var date = req.params.date;
    var values = "(" + parseInt(id) + ", "
        + mysql.escape(productName) + ", "
        + mysql.escape(customer) + ", "
        + mysql.escape(description) + ", "
        + mysql.escape(date.toString()) + ")";
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
