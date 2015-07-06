exports.LOGTYPES = {
    ADDPILE               : {value: 100, name: "Added Pile"},
    ADDRUN                : {value: 200, name: "Added Run"},
    REMOVEPILE            : {value: 300, name: "Removed Pile"},
    REMOVERUN             : {value: 400, name: "Removed Run"},
    AUDIT                 : {value: 500, name: "Audited"},
    NOTE                  : {value: 600, name: "Noted"},
    NEWPRODUCTCREATED     : {value: 700, name: "Created New Product"}
};

/* Use of Logs.GenericVar in DB:
 ADDPILE - unused
 ADDRUN - quantity available for run added
 REMOVEPILE - unused
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

    var time = formattedDateTime();  // get current time as formatted string
    return database.query("INSERT INTO " + database.logTable + " VALUES (NULL, " + logType + ", " + productId + ", " + username + ", " + time + ", " + general + ")");
};

// Get date/time and format into an acceptable string for MySql datetime data type
function formattedDateTime() {
    var newTime = new Date();
    // add a 0 to pad 1, 2, 3, 4, 5, 6, 7, 8, 9 to 01, 02, etc.
    function pad(n) {
        if (n < 10)
            return '0' + n;
        else
            return n;
    }
    return "'" + newTime.getFullYear() + "-" + pad(1 + newTime.getMonth()) + "-" + pad(newTime.getDate()) + " " + pad(newTime.getHours()) + ":" + pad(newTime.getMinutes()) + ":" + pad(newTime.getSeconds()) + "'";
}


/* ******************************************************************
TODO:
 Need to finish this code still:
 - Retrieve data needed for logging from DB if not provided.
 - Add appropriate errors for missing info that can't be retrieved.
 */