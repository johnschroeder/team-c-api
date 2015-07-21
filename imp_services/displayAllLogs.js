var Q = require("q");

var displayLogs = require("../imp_services/displayLogs.js");

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

    displayLogs: function (callback) {
        var stringLogs = [];
        var ids = [];

        var db = require("../imp_services/impdb.js").connect();


            return Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query())
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
                        console.log(stringLogs[i]);
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
    }
};
