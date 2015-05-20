var mysql = require("mysql");
var config = require("konfig");
var express = require("express");
var router = express.Router();


router.route("/").get(function(req,res){

    var databaseName = "imp_db";

    /* To substitute into the query, if you want to add more tables, add them here and then insert them into query */
    var ProductTable = "Products";
    var RunTable = "Runs";
    var BatchTable = "Batches";

    /* If you edit any tabels, add the fields here and it will change it in the query
     * Also note that this should probably be moved to a module */
    var ProdFields = "(ProductID int AUTO_INCREMENT, Name varchar(255), Customer varchar(255), Description varchar(255), DateCreated date, PRIMARY KEY (ProductID))";
    var RunFields = "(RunID int AUTO_INCREMENT, ProductID int, Date date, PRIMARY KEY (RunID), FOREIGN KEY (ProductID) REFERENCES Products(ProductID))";
    var BatchFields ="(RunID int, Amount float, Location VARCHAR(100), Foreign Key (RunID) References Runs(RunID))";

    /* Connects to mySQL server */
    var connection = mysql.createConnection({
        host: "localhost",
        user: "elijahvarga",
        password: "dev.db124"

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
                            }
                            /*here is where the result of the query is happening
                             * res.send is what we use to send things to the server it is like the return of a function */
                            else {
                                var invUnit = JSON.stringify(result);
                                res.send(invUnit);
                                connection.end();
                            }
                        });
                    }
                }
            });
        };
    };

    var queryToExecute = queryFunction("USE " + databaseName,
        queryFunction("CREATE TABLE IF NOT EXISTS " + BatchTable + " " + BatchFields + ";",
            queryFunction("CREATE TABLE IF NOT EXISTS " + ProductTable + " " + ProdFields,
                queryFunction("CREATE TABLE IF NOT EXISTS " + RunTable + " " + RunFields,
                   queryFunction("SELECT * FROM "
                    + BatchTable + " NATURAL JOIN "
                    + RunTable   + " NATURAL JOIN "
                    + ProductTable + " "
                    + "GROUP BY " + " ProductID, " + "RunID;"
                    )
                )
            )
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
