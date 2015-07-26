var Q = require("q");

var LogTypeMap = {};
LogTypeMap[100] = {
    type: "Added Inventory",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + "Added " + actionData.quantity + " units of product " + actionData.productId + " to location " + actionData.location;
    }
};
LogTypeMap[200] = {
    type: "Added Product Size",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + "Added product size " + actionData.sizeName + " (" + actionData.size + ") for product " + actionData.productId;
    }
};
LogTypeMap[300] = {
    type: "Added Item to Job",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + "Added " + actionData.amount + " units of product " + actionData.productId + " to job " + actionData.cartName;
    }
};
LogTypeMap[400] = {
    type: "Created Product",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + "Created product '" + actionData.productName + "' on " + actionData.date;
    }
};
LogTypeMap[500] = {
    type: "Associated Product With Customer",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + "Associated product " + actionData.productId + " with customer " + actionData.customerId;
    }
};
LogTypeMap[600] = {
    type: "Edited Product",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + "Edited product " + actionData.productId + " (" + actionData.productName + ")";
    }
};
LogTypeMap[700] = {
    type: "Created Job",
    callFunction: function (LogType, logUsername, time, actionData) {
        return time + " - " + logUsername + ": " + "Created new job '" + actionData.cartName + "' assigned to " + actionData.assignee + ", will expire in " + actionData.daysToDelete + " days";
    }
};
LogTypeMap[800] = {
    type: "Created User",
    callFunction: function (LogType, logUsername, time, actionData) {
        return time + " - " + logUsername + ": " + "Created new user " + actionData.value;
    }
};
LogTypeMap[900] = {
    type: "Logged In User",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + actionData.user + " logged in";
    }
};
LogTypeMap[901] = {
    type: "Logged Out User",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + actionData.user + " logged out";
    }
};
LogTypeMap[1000] = {
    type: "Disassociated Product With All Customers",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + "Disassociated product " + actionData.productId + " with all customers";
    }
};
LogTypeMap[1100] = {
    type: "Added Customer",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + "Added customer " + actionData.customerName;
    }
};
LogTypeMap[1200] = {
    type: "Deleted Product",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + "Deleted product " + actionData.productId;
    }
};
LogTypeMap[1300] = {
    type: "Edited Job",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + "Updated job " + actionData.cartId + " -> " + actionData.cartName;
    }
};
LogTypeMap[1400] = {
    type: "Edited Job Item",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + "Updated job item " + actionData.cartItemId + " in job " + actionData.cartId;
    }
};
LogTypeMap[1500] = {
    type: "Deleted Job Item",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + "Deleted job item " + actionData.cartItemId;
    }
};

    function toStringDefault (LogType, logUsername,  time,  actionData) {
    return time + " - " + LogTypeMap[LogType].type;
}

function typeNotAddedYet (LogType, logUsername, time, actionData) {
    return time + " - " + logUsername + ": " + "log type '" + LogType + "' not added yet";
}

module.exports =
{
    _verifyKey: function (key) {
        return LogTypeMap[key] == undefined ? false : true;
    },

    displayLogs: function (adminView, cookie, callback) {
        var stringLogs = [];
        var ids = [];

        var db = require("../imp_services/impdb.js").connect();

        require("../imp_services/impredis.js").get(cookie, function usernameReturn(error, val) {
            var username = val.username;
            var call = "CALL GetLogsUserView(\'" + username + "\');";
            if (adminView) {
                call = "CALL GetAllLogs();";
            }
            return Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query(call))
                .then(function (rows) {

                    if (rows[0][0].length == 0) { // No user by that username
                        return "Invalid Result!";
                    }

                    for (var i = 0; i < rows[0][0].length; i++) {
                        var row = rows[0][0][i];
                        var logID = row.LogID;
                        var LogType = row.LogType;
                        var logUsername = row.Username;
                        var time = row.Time;
                        var actionData = row.ActionData;

                        if (LogTypeMap[LogType] == null) {
                            stringLogs.push(typeNotAddedYet(LogType, logUsername, time, JSON.parse(actionData)));
                        } else {
                            stringLogs.push(LogTypeMap[LogType].callFunction(LogType, logUsername, time, JSON.parse(actionData)));
                        }
                        ids.push(logID);
                        //console.log(stringLogs[i]);
                    }

                    var jsonObject = {logs:stringLogs, id:ids};

                    callback(JSON.stringify(jsonObject));

                })
                .then(db.commit())
                .then(db.endTransaction())
                .catch(function (err) {
                    Q.fcall(db.rollback())
                        .then(db.endTransaction());
                    console.log("We had an error");
                    console.log("Error: " + err);
                })
                .done();
        })
    }
};
