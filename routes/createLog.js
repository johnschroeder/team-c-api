var express = require("express");
var router = express.Router();
var Q = require('q');

router.route('/:logType/:username/:time/:actionData').get(function(req,res) {
    var logsService = require('../../imp_services/displayLogs');

    var logType = req.params.logType;
    var username = req.params.username;
    var Time = req.params.time;
    var ActionData = req.params.actionData;
    logsService.addLog(database, logType, Time, username, ActionData, function done (reponse) { console.log(reponse); });
res.end("Log Added");
});

module.exports = router;