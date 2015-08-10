var mySQL = require("mysql");
var config = require("konfig")();
var Q = require("q");

// Modify the number of allowed connections here (please limit to 3 for development)
var MAX_CONNECTIONS = config.app.mysql.maxConnections;
var connectionID = 0;
var debug = config.app.mysql.debug === "true";
var pool = false; // pool doesn't yet exist.  This should only be the case on server restart

exports.connect = function() {
    if(!pool) {
        return createPool();
    }
    return createAPIObject(pool);
};

/**
 * SO code.  handles timeouts
 */
function handleDisconnect(poolElement) {

    poolElement.connection.on('error', function(err) {
        if (!err.fatal) {
            return;
        }

        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            throw err;
        }


        if(debug) {
            console.log("****DB****");
            console.log(Date.now() + " --- Connection " + poolElement.ID + " was disconnected.  Reconnecting.");
        }
        poolElement.connection = mySQL.createConnection(poolElement.connection.config);
        handleDisconnect(poolElement);
        poolElement.connection.connect();
        if(debug) {
            console.log(Date.now() + " --- Connection " + poolElement.ID + " reconnected.")
            console.log("****/DB****");
        }
    });
}


/**
 * Creates the connection pool
 */
var createPool = function() {
    pool = [];
    for(var i = 0; i < MAX_CONNECTIONS; ++i)
    {
        var poolElement =
        {
            connection:mySQL.createConnection({
                host: config.app.mysql.host,
                user: config.app.mysql.user,
                password: config.app.mysql.password
            }),
            ID: connectionID++

        };
        if(debug) {
            console.log("****DB****");
            console.log(Date.now() + " --- Connection " + poolElement.ID + " added to pool.");
            console.log("****/DB****");
        }
        handleDisconnect(poolElement); // ensures connection has not timed out
        pool.push(poolElement);
    }
    return createAPIObject(pool);
};

/**
 * Creates the connection-delivering object which require delivers on demand
 */
var createAPIObject = function(pool) {
    /* Connects to mySQL server */
    var poolElement = null;

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
    toReturn.spAddItemToCart = "AddItemToCart";
    toReturn.spAddItemToCartGeneral = "AddItemToCartGeneral";
    toReturn.spDeleteCart = "DeleteCart";
    toReturn.spGetCartItems = "GetCartItems";
    toReturn.spEditCartItem = "EditCartItem";

    toReturn.beginTransaction = function(numberOfAttempts) {
        if(pool.length <= 0) {
            if(debug) {
                console.log("****DB****");
                console.log(Date.now() + " --- Error: No database connections available");
                console.log("****/DB****");
            }
            var attempts = numberOfAttempts || 0;
            if(attempts < 5){
                setTimeout(function(){
                    this.beginTransaction(attempts+1);
                }, 5000);
                
            }
            else{
                if(debug) {
                    console.log("****DB****");
                    console.log(Date.now() + " --- No connections available after 5 attempts.");
                    console.log("****/DB****");
                }
                throw "Connection could not be established, no pooled connection available after 5 attempts";
            }
        }
        else{
            poolElement = pool.shift(); // dequeue from pool
            if(debug) {
                console.log("****DB****");
                console.log(Date.now() + " --- Transaction begun with connection " + poolElement.ID);
                console.log("****/DB****");
            }
            return Q.nfbind(poolElement.connection.beginTransaction.bind(poolElement.connection));
        }
    };

    toReturn.query = function(queryInput) {
        if(debug) {
            console.log("****DB****");
            console.log(Date.now() + " --- Query beginning with connection " + poolElement.ID);
            console.log(queryInput);
            console.log("****/DB****");
        }
        return Q.nfbind(poolElement.connection.query.bind(poolElement.connection, queryInput));
    };

    toReturn.commit = function() {
        if(debug) {
            console.log("****DB****");
            console.log(Date.now() + " --- Committing transaction with connection " + poolElement.ID);
            console.log("****/DB****");
        }
        return Q.nfbind(poolElement.connection.commit.bind(poolElement.connection));
    };

    toReturn.endTransaction = function() {
        if(poolElement != null) {
            if (debug) {
                console.log("****DB****");
                console.log(Date.now() + " --- Returning connection " + poolElement.ID + " to the pool");
                console.log("****/DB****");
            }
            pool.push(poolElement); // enqueue connection (return to pool)
            poolElement = null; // set local connection reference to null
        } else {
            console.log("****DB****");
            console.log(Date.now() + " --- endTransaction called while no transaction was open.")
            console.log("****/DB****");
        }
    };

    toReturn.rollback = function() {
        if(poolElement != null) {
            if (debug) {
                console.log("****DB****");
                console.log(Date.now() + " --- Rolling back transaction with connection " + poolElement.ID);
                console.log("****/DB****");
            }
            return Q.nfbind(poolElement.connection.rollback.bind(poolElement.connection));
        } else {
            console.log("****DB****");
            console.log(Date.now() + " --- rollback called while no transaction was open.")
            console.log("****/DB****");
        }

    };

    return toReturn;
};

