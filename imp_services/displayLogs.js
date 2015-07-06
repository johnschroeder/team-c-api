/**
 * Created by Trevor on 7/3/2015.
 */
var Q = require("q");

/* var a = {};
 a["key1"] = "value1";
 a["key2"] = "value2";
 */

var LogTypeMap = {};
LogTypeMap[100] = "Added Pile";
LogTypeMap[200] = "Added Run";
LogTypeMap[300] = "Removed Pile";
LogTypeMap[400] = "Removed Run";
LogTypeMap[500] = "Audited";
LogTypeMap[600] = "Noted";
LogTypeMap[700] = "Created New Product";
LogTypeMap[800] = "Created User";

var functionMap = {};
functionMap[100] = toStringDefault;
functionMap[200] = toStringDefault;
functionMap[300] = toStringDefault;
functionMap[400] = toStringDefault;
functionMap[500] = toStringDefault;
functionMap[600] = toStringDefault;
functionMap[700] = toStringDefault;
functionMap[800] = toStringDefault;

var stringLogs = [];
var jsonString = '{"logs":[';

function toStringDefault (jsonObj) {
    var logObj = JSON.parse(jsonObj);
    //console.log(jsonObj);
    var actionPiece = JSON.parse(logObj.action).value;
    //console.log("Action Piece " + actionPiece);
    return logObj.username + " on " + logObj.time + " " + LogTypeMap[logObj.logType] + " " + actionPiece;
}

module.exports =

{
    displayLogs: function (username, callback) {
        var db = require("../imp_services/impdb.js").connect();
        //var defer = Q.defer();
       return Q.fcall(db.beginTransaction())
            .then(db.query("USE " + db.databaseName))
            .then(db.query("CALL GetLogsUserView(\'" + username + "\');"))
            .then(function (rows) {

                // We got data about the user
                if (rows[0][0].length == 0) { // No user by that username
                    return "Invalid Result!";
                }

                var jsonLogs = [];
                //console.log("---- Now to show the rows ------");
                for (var i = 0; i < rows[0][0].length; i++) {
                    var row = rows[0][0][i];
                    var logID = row.LogID;
                    var LogType = row.LogType;
                    var logUsername = row.Username;
                    var time = row.Time;
                    var actionData = row.ActionData;
                    jsonLogs[i] = '{"logID":"' + logID + '", "logType":"' + LogType +
                        '","username":"' + logUsername + '","time":"' + time + '","action":"' + actionData + '"}';

                    stringLogs[i] = functionMap[LogType](jsonLogs[i]);
                }

                for (var j = 0; j < stringLogs.length; j++) {
                    jsonString += '"' + stringLogs[j] + '"';
                    if (j + 1 < stringLogs.length) {
                        jsonString += ',';
                    }
                }
                jsonString += ']}';
                console.log(jsonString);
                callback(jsonString);

            }) .then(db.endTransaction()) // This is called right?
            .catch(function (err) {
                Q.fcall(db.rollback())
                    .then(db.endTransaction())
                    .then(console.log("We had an error"))
                    .done();
                console.log("Error: " + err);
            }).done();
    },

    addLog: function (LogType, username, ActionData, callback) {
        var db = require("../imp_services/impdb.js").connect();

        var call = "CALL LogAction("+ LogType + "," + "\'" + username +"\'" + "," + "\'" + ActionData + "\');";
       // console.log(call);
        Q.fcall(db.beginTransaction())
            .then(db.query("USE " + db.databaseName))
            .then(db.query(call))
            .then(function (rows) {
                callback("Log Added!");

            }).then (db.commit())
            .then(db.endTransaction())
            .catch(function (err) {
                Q.fcall(db.rollback())
                    .then(db.endTransaction())
                    .then(console.log("We had an error"))
                    .done();
                console.log("Error: " + err);
            }).done();
    }

};