/**
 * Created by requi_000 on 5/21/2015.
 */
var mySQL = require("mysql");
var config = require("konfig")();
var Q = require("q");

    exports.connect = function() {
        /* Connects to mySQL server */
        var connection;

        var toReturn = {};
        toReturn.databaseName = "imp_db";

        /* To substitute into the query, if you want to add more tables, add them here and then insert them into query */
        toReturn.productTable = "Products";
        toReturn.runTable = "Runs";
        toReturn.batchTable = "Batches";

        /* If you edit any tables, add the fields here and it will change it in the query */
        toReturn.productFields = "(ProductID int AUTO_INCREMENT, Name varchar(255), Customer varchar(255), Description varchar(255), DateCreated date, PRIMARY KEY (ProductID))";
        toReturn.runFields = "(RunID int AUTO_INCREMENT, ProductID int, Date date, PRIMARY KEY (RunID), FOREIGN KEY (ProductID) REFERENCES Products(ProductID))";
        toReturn.batchFields = "(RunID int, Amount float, Location VARCHAR(100), Foreign Key (RunID) References Runs(RunID))";

        toReturn.DispInventory = "DispInventory";

        toReturn.beginTransaction = function() {
            connection = mySQL.createConnection({
                host: config.app.mysql.host,
                user: config.app.mysql.user,
                password: config.app.mysql.password
            });
            toReturn.connection = connection;
            return Q.nfbind(connection.beginTransaction.bind(connection));
        };

        toReturn.query = function(queryInput) {
            return Q.nfbind(connection.query.bind(connection, queryInput));
        };

        toReturn.commit = function() {
            return Q.nfbind(connection.commit.bind(connection));
        };

        toReturn.endTransaction = function() {
            return Q.nfbind(connection.end.bind(connection));
        };

        toReturn.rollback = function() {
            return Q.nfbind(connection.rollback.bind(connection));
        };

        return toReturn;
    };




