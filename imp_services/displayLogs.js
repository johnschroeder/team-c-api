/**
 * Created by Trevor on 7/3/2015.
 */

module.exports =

{
    displayLogs: function () {

//Get all logs from the db --- requires db procedure
//Ignore all logs the user wants ignored --- requires db procedure


        //For each log left over, get the toString output
        //Create line output: user, timestamp, type name, and tostring for log
        // I'm counting action as a String for now. What methods an 'action' will have is not defined yet.
        // One interpretation I think might work is for action to be the specific instance of a type of log
        // for instance Date-Trevor-LogType [made user] - action [Steve] - (logID used but not shown)
        var allLogs = []; //[{timestamp:Date, user:String, action:String, logID:int, type:LogTypes}];
        var logStrings = ["I am stuff to display", "I am stuff too", "Fly my warguls fly!!!"];

        var jsonLogs = [
            { "value":"Doe" },
            { "value":"Smith" },
            { "value":"Jones" }];
        /*
         '{ "logs" : [';

         for (var i = 0; i <= allLogs.length; i++)
         {
         jsonLogs += '{"value:":' + Map[allLogs[i].type].toString(allLogs[i]) + '}';
         if (i +1 < allLogs.length)
         {
         jsonLogs += ',';
         }

         }

         jsonLogs += ']}';
         */


//Return or pipe the logs to the frontend
        var jsonAsString = JSON.stringify(jsonLogs);
        console.log(jsonAsString);
        return jsonAsString;

    },

var:LOGTYPES = {
    ADDPILE               : {value: 100, name: "Added Pile"},
    ADDRUN                : {value: 200, name: "Added Run"},
    REMOVEPILE            : {value: 300, name: "Removed Pile"},
    REMOVERUN             : {value: 400, name: "Removed Run"},
    AUDIT                 : {value: 500, name: "Audited"},
    NOTE                  : {value: 600, name: "Noted"},
    NEWPRODUCTCREATED     : {value: 700, name: "Created New Product"}
},
    var:defaultToString = function (actionObject) {
        actionObject.user + " on" + actionObject.timestamp + " " + type.name + " " + actionObject.action;
    },

    var:Map = {
        Type: this.LOGTYPES,
        toString: Function
        //name: "Create User"
    }

};