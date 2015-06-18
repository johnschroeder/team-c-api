exports.LOGTYPES = {
    ADDPILE              : {value: 100, name: "AddPile"},
    ADDRUN               : {value: 200, name: "AddRun"},
    REMOVEPILE           : {value: 300, name: "REMOVEPILE"},
    REMOVERUN            : {value: 400, name: "RemoveRun"},
    AUDIT                : {value: 500, name: "Audit"},
    NOTE                 : {value: 600, name: "Note"},
    NEWPRODUCTCREATED    : {value: 700, name: "New Product Created"}
};

/* Use of Logs.GenericVar in DB:
 ADDPILE - unused
 ADDRUN - quantity available for run added
 REMOVERUN - unused
 AUDIT - unused
 NOTE - unused
 NEWPRODUCTCREATED - unused
 */

/* This method is used for updating the log, and can be nested within a .then() promise statement.
 database - already established DB connections (require("../imp_services/impdb.js").connect())
 logType  - type of log action, see above (LOGTYPES.ADD.value)
 productId - product ID of related inventory product
 username - username for user causing log action
 general - extra variable depending on transaction type (see use of Logs.GenericVar above)
 */
exports.updateLog = function(database, logType, productId, username, general) {
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
    if (username == null) {
        // TODO: handle this error, remove line below
        username = "'hansolo'";
    }
    if (general == null) {
        // not used in all cases, valid for it to be null
        general = "NULL";
    }
    var time = formattedTime();  // get current time as formatted string
    return database.query("INSERT INTO " + database.logTable + " VALUES (NULL, " + logType + ", " + productId + ", " + username + ", " + time + ", " + general + ")");
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