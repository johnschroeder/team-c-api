var mySQL = require("mysql");
var config = require("konfig")();
var Q = require("q");

var MAX_CONNECTIONS = 3;

var pool = false;

exports.connect = function() {
    if(!pool) {
        return createPool();
    }
    return createAPIObject(pool);
};

var createPool = function() {
    pool = [];
        var connection = mySQL.createConnection({
                host: config.app.mysql.host,
                user: config.app.mysql.user,
                password: config.app.mysql.password
        });
        pool.push(connection);
    console.log(pool);
    return createAPIObject(pool);
};


var createAPIObject = function(pool) {
    /* Connects to mySQL server */
    var connection = null;

    var toReturn = {};
    toReturn.databaseName = config.app.mysql.databaseName;
    console.log(toReturn.databaseName);

    /* To substitute into the query, if you want to add more tables, add them here and then insert them into query */
    toReturn.productTable = "Products";
    toReturn.pileTable = "Piles";
    toReturn.runTable = "Runs";
    toReturn.logTable = "Logs";
    toReturn.cartTable = "Cart";
    toReturn.cartitemTable = "CartItems";
    toReturn.spDeleteItemInCart = "DeleteItemInCart";
    toReturn.spAddItemToCart = "AddItemToCart";
    toReturn.spAddItemToCartGeneral = "AddItemToCartGeneral";
    toReturn.spDeleteCart = "DeleteCart";
    toReturn.spGetCartItems = "GetCartItems";
    toReturn.spGetCartsByUser = "GetCartsByUser";
    toReturn.spEditCartItem = "EditCartItem";

    toReturn.beginTransaction = function() {
        if(pool.length <= 0) {
            console.log("Error: No database connections available");
        }
        connection = pool.shift();
        return Q.nfbind(connection.beginTransaction.bind(connection));
    };

    toReturn.query = function(queryInput) {
        return Q.nfbind(connection.query.bind(connection, queryInput));
    };

    toReturn.commit = function() {
        return Q.nfbind(connection.commit.bind(connection));
    };

    toReturn.endTransaction = function() {
        pool.push(connection);
        connection = null;
    };

    toReturn.rollback = function() {
        return Q.nfbind(connection.rollback.bind(connection));
    };

    return toReturn;
};

