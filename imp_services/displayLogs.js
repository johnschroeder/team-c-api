var Q = require("q");

var LogTypeMap = {};
LogTypeMap[100] = {type: "Added Inventory", callFunction:toStringAddInventory};
LogTypeMap[800] = {type: "Created User", callFunction:toStringCreatedUser};
LogTypeMap[900] = {type: "temp", callFunction:toStringDefault};


var stringLogs = [];

function toStringDefault (LogType, logUsername,  time,  actionData) {
    return time + " - " + LogTypeMap[LogType].type;
}

function toStringCreatedUser (LogType, logUsername,  time,  actionData) {
    return time + " - " + logUsername + ": " + "Created new user " + actionData.value;
}

function toStringAddInventory (LogType, logUsername, time, actionData) {
    return time + " - " + logUsername + ": " + "Added " + actionData.quantity + " units of product " + actionData.productId + " to location " + actionData.location;
}

module.exports =
{
    _verifyKey: function (key) {
        return LogTypeMap[key] == undefined ? false : true;
    },

    displayLogs: function (cookie, callback) {

        var db = require("../imp_services/impdb.js").connect();

        require("../imp_services/impredis.js").get(cookie, function usernameReturn(error, val)
        {
            var username = val.username;

            return Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("CALL GetLogsUserView(\'" + username+ "\');"))
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

                        stringLogs.push(LogTypeMap[LogType].callFunction(LogType, logUsername, time, JSON.parse(actionData)));
                        console.log(stringLogs[i]);
                    }

                    var jsonObject = {logs:stringLogs};

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