/**
 * Created by Trevor on 7/3/2015.
 */
var Q = require("q");

/* var a = {};
 a["key1"] = "value1";
 a["key2"] = "value2";
 */

var LogTypeMap = {};
LogTypeMap[100] = {type: "Added Pile", callFunction:toStringDefault};
LogTypeMap[200] = {type: "Added Run", callFunction:toStringDefault};
LogTypeMap[300] = {type: "Removed Pile", callFunction:toStringDefault};
LogTypeMap[400] = {type: "Removed Run", callFunction:toStringDefault};
LogTypeMap[500] = {type: "Audited", callFunction:toStringDefault};
LogTypeMap[600] = {type: "Noted", callFunction:toStringDefault};
LogTypeMap[700] = {type: "Created New Product", callFunction:toStringDefault};
LogTypeMap[800] = {type: "Created User", callFunction:toStringDefault};


var stringLogs = [];
var jsonString = '{"logs":[';

function toStringDefault (jsonObj) {
    var logObj = JSON.parse(jsonObj);
    //console.log(jsonObj);
    var actionPiece = JSON.parse(logObj.action).value;
    //console.log("Action Piece " + actionPiece);
    return logObj.username + " on " + logObj.time + " " + LogTypeMap[logObj.logType].type + " " + actionPiece;
}



module.exports =

{
    _verifyKey :function (key) {
        return LogTypeMap[key] == undefined ? false : true;
    },

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

                    stringLogs[i] = LogTypeMap[LogType].callFunction(jsonLogs[i]);
                }

                for (var j = 0; j < stringLogs.length; j++) {
                    jsonString += '"' + stringLogs[j] + '"';
                    if (j + 1 < stringLogs.length) {
                        jsonString += ',';
                    }
                }
                jsonString += ']}';
                //console.log(jsonString);
               //console.log(module.exports._verifyKey(800));
                callback(jsonString);

            }) .then(db.endTransaction()) // This is called right?
            .catch(function (err) {
                Q.fcall().then(db.endTransaction())
                    .then(console.log("We had an error"))
                console.log("Error: " + err);
            }).done();
    }
};