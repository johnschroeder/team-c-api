var mySQL = require("mysql");
var config = require("konfig")();
var Q = require("q");

// Modify the number of allowed connections here (please limit to 3 for development)
var MAX_CONNECTIONS = config.app.mysql.maxConnections;

var pool = false; // pool doesn't yet exist.  This should only be the case on server restart

exports.connect = function() {
    if(!pool) {
        return createPool();
    }
    return createAPIObject(pool);
};

/**
 * Creates the connection pool
 */
var createPool = function() {
    pool = [];
    for(var i = 0; i < MAX_CONNECTIONS; ++i)
    {
        var connection = mySQL.createConnection({
            host: config.app.mysql.host,
            user: config.app.mysql.user,
            password: config.app.mysql.password
        });
        pool.push(connection);
    }
    return createAPIObject(pool);
};

/**
 * Creates the connection-delivering object which require delivers on demand
 */
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

    toReturn.beginTransaction = function(x) {
        if(pool.length <= 0) {
            console.log("Error: No database connections available");
            var attempts = x || 0;
            if(attempts < 5){
                setTimeout(function(){
                    this.beginTransaction(attempts+1);
                }, 5000);
                
            }
            else{
                throw "Connection could not be established, no pooled connection available after 5 attempts";
            }
        }
        else{
            connection = pool.shift(); // dequeue from pool
            handleDisconnect(connection); // ensures connection has not timed out
            return Q.nfbind(connection.beginTransaction.bind(connection));
        }
    };

    toReturn.query = function(queryInput) {
        handleDisconnect(connection); // ensures connection has not timed out
        return Q.nfbind(connection.query.bind(connection, queryInput));
    };

    toReturn.commit = function() {
        return Q.nfbind(connection.commit.bind(connection));
    };

    toReturn.endTransaction = function() {
        pool.push(connection); // enqueue connection (return to pool)
        connection = null; // set local connection reference to null
    };

    toReturn.rollback = function() {
        return Q.nfbind(connection.rollback.bind(connection));
    };

    /**
     * SO code.  handles timeouts
     */
    function handleDisconnect(connection) {
        connection.on('error', function(err) {
            if (!err.fatal) {
                return;
            }

            if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
                throw err;
            }

            console.log('Re-connecting lost connection: ' + err.stack);

            connection = mySQL.createConnection(connection.config);
            handleDisconnect(connection);
            connection.connect();
        });
    }

    return toReturn;
};

