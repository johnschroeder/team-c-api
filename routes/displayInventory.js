var mysql = require("mysql");
var config = require("konfig")();
var express = require("express");
var router = express.Router();


router.route("/:prodID/:name/:customer:/description/:dateCreated:/RunID:/Amount").get(function(req,res){

    var databaseName = "impDB";

    /* To substitute into the query, if you want to add more tables, add them here and then insert them into query */
    var ProductTable = "Products";
    var RunTable = "Runs";
    var BatchTable = "Batches"

    /* Connects to mySQL server */
    var connection = mysql.createConnection({
        host: config.app.mysql.host,
        user: config.app.mysql.user,
        password: config.app.mysql.password
    });

    /* to figure out what queryInput is, look at queryExecute function, queryInput is the incoming argumentargument */
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
        queryFunction("SELECT * FROM"
            + BatchTable + ", "
            + RunTable   + ", "
            + ProductTable + " "
            + "WHERE "
            + ProductTable +".ProductID =" + RunTable + ".RunID"
            + "AND "
            + RunTable + ".RunID = " + BatchTable + ".RunID"
            + "GROUP BY" +ProductTable + "ProductID," + RunTable + ".RunID"
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
