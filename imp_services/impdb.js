/**
 * Created by requi_000 on 5/21/2015.
 */
var mySQL = require("mysql");
var config = require("konfig")();
var Q = require("q");

/* Connects to mySQL server */
var connection = mySQL.createConnection({
    host: config.app.mysql.host,
    user: config.app.mysql.user,
    password: config.app.mysql.password
});

    exports.connect = function() {

        var toReturn = {}
        toReturn.connection = connection;
        toReturn.databaseName = "imp_db";

        /* To substitute into the query, if you want to add more tables, add them here and then insert them into query */
        toReturn.productTable = "Products";
        toReturn.runTable = "Runs";
        toReturn.batchTable = "Batches";

        /* If you edit any tables, add the fields here and it will change it in the query */
        toReturn.prodFields = "(ProductID int AUTO_INCREMENT, Name varchar(255), Customer varchar(255), Description varchar(255), DateCreated date, PRIMARY KEY (ProductID))";
        toReturn.runFields = "(RunID int AUTO_INCREMENT, ProductID int, Date date, PRIMARY KEY (RunID), FOREIGN KEY (ProductID) REFERENCES Products(ProductID))";
        toReturn.batchFields = "(RunID int, Amount float, Location VARCHAR(100), Foreign Key (RunID) References Runs(RunID))";

        toReturn.beginTransaction = function() {
            var deferred = Q.defer();
            deferred.resolve(Q.nfncall(connection.beginTransaction()));
            return deferred;
        }

        toReturn.query = function(queryInput) {
            return Q.nfcall(connection.query(queryInput))
        }

        toReturn.commit = function() {
            return Q.nfcall(connection.commit());
        }

        toReturn.endTransaction = function() {
            return Q.nfcall(connection.end());
        }

        toReturn.rollback = function() {
            return Q.nfcall(connection.rollback());
        }

        return toReturn;
    }




