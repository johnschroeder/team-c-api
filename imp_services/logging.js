exports.LOGTYPES = {
    ADD               : {value: 100, name: "Add"},
    REMOVE            : {value: 200, name: "Remove"},
    AUDIT             : {value: 300, name: "Audit"},
    NOTE              : {value: 400, name: "Note"},
    NEWPRODUCTCREATED : {value: 500, name: "New Product Created"}
};

/* Use of Logs.GenericVar in DB:
 ADD - quantity added
 REMOVE - quantity removed
 AUDIT - unused
 NOTE - unused
 NEWPRODUCTCREATED - unused
 */

/* This method is used for updating the log, and can be nested within a .then() promise statement.
 database - already established DB connections (require("../imp_services/impdb.js").connect())
 logType  - type of log action, see above (LOGTYPES.ADD.value)
 productId - product ID of related inventory product
 userId - userId for user causing log action
 customerId - customer ID for related customer
 date - current data/time that transaction took place
 general - extra variable depending on transaction type (see use of Logs.GenericVar above)
 */
exports.updateLog = function(database, logType, productId, userId, customerId, general) {
    // TODO: Look into using Q.defer() here
    if (database == null) {
        console.log("database arg in updateLog() is null");
        // TODO: handle this error
    }
    if (logType == null) {
        console.log("logType arg in updateLog() is null");
        // TODO: handle this error
    }
    if (productId == null) {
        // TODO: go retrieve from DB, remove line below
        productId = 101;
    }
    if (userId == null) {
        // TODO: handle this error, remove line below
        userId = 204;
    }
    if (customerId == null) {
        // TODO: go retrieve from DB, remove line below
        customerId = 402;
    }
    if (general == null) {
        // not used in all cases, valid for it to be null
        general = "NULL";
    }
    var time = formattedTime();  // get current time as formatted string
    return database.query("INSERT INTO " + database.logTable + " VALUES (NULL, " + logType + ", " + productId + ", " + userId + ", " + customerId + ", " + time + ", " + general + ")");
};

// Get date/time and format into an acceptable string for MySql datetime data type
function formattedTime() {
    var newTime = new Date();
    // add a 0 to pad 1, 2, 3, 4, 5, 6, 7, 8, 9 to 01, 02, etc.
    function pad(n) {
        return n < 10 ? '0' + n : n;
    }
    return "'" + newTime.getFullYear() + "-" + pad(1 + newTime.getMonth()) + "-" + pad(newTime.getDate()) + " " + pad(newTime.getHours()) + ":" + pad(newTime.getMinutes()) + ":" + pad(newTime.getSeconds()) + "'";
}


/* ******************************************************************
TODO:
 Need to finish this code still:
 - Retrieve data needed for logging from DB if not provided.
 - Add appropriate errors for missing info that can't be retrieved.
 */