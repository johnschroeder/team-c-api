var Q = require("q");

var LogTypeMap = {};
LogTypeMap[100] = {type: "Added Pile", callFunction:toStringDefault};
LogTypeMap[200] = {type: "Added Run", callFunction:toStringDefault};
LogTypeMap[300] = {type: "Removed Pile", callFunction:toStringDefault};
LogTypeMap[400] = {type: "Removed Run", callFunction:toStringDefault};
LogTypeMap[500] = {type: "Audited", callFunction:toStringDefault};
LogTypeMap[600] = {type: "Noted", callFunction:toStringDefault};
LogTypeMap[700] = {type: "Created New Product", callFunction:toStringDefault};
LogTypeMap[800] = {type: "Created User", callFunction:toStringDefault};

LogTypeMap[900] = {
    type: "Logged In User",

    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + actionData.user + " logged in.";
    }
};

var stringLogs = [];

function toStringDefault (LogType, logUsername,  time,  actionData) {
    return logUsername + " on " + time + " " + LogTypeMap[LogType].type + " " + actionData.value;
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
