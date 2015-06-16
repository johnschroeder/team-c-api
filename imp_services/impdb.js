var mySQL = require("mysql");
var config = require("konfig")();
var Q = require("q");

    exports.connect = function() {
        /* Connects to mySQL server */
        var connection;

        var toReturn = {};
        toReturn.databaseName = config.app.mysql.databaseName;
        console.log(toReturn.databaseName);

        /* To substitute into the query, if you want to add more tables, add them here and then insert them into query */
        toReturn.productTable = "Products";
        toReturn.runTable = "Runs";
        toReturn.batchTable = "Batches";
        toReturn.logTable = "Logs";
        toReturn.cartTable = "Cart";
        toReturn.cartitemTable = "CartItems";
        toReturn.spDeleteItemInCart = "DeleteItemInCart";
        toReturn.spAddItemToCart = "AddItemToCart";
        toReturn.spDeleteCart = "DeleteCart";
        toReturn.spGetCartItems = "GetCartItems";


        /* If you edit any tables, add the fields here and it will change it in the query */
        toReturn.productFields = "(ProductID int AUTO_INCREMENT, Name varchar(255), Customer varchar(255), Description varchar(255), DateCreated date, PRIMARY KEY (ProductID))";
        toReturn.runFields = "(RunID int AUTO_INCREMENT, ProductID int, Date date, PRIMARY KEY (RunID), FOREIGN KEY (ProductID) REFERENCES Products(ProductID))";
        toReturn.batchFields = "(RunID int, Amount float, Location VARCHAR(100), Foreign Key (RunID) References Runs(RunID))";
        toReturn.logFields = "(LogID int AUTO_INCREMENT, LogType int, ProductID int, UserID int, CustomerID int, Time datetime, GenericVar int, PRIMARY KEY (LogID), "
            + "FOREIGN KEY (ProductID) REFERENCES Products(ProductID), FOREIGN KEY (UserID) REFERENCES Users(UserID), FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID))";

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




