/**
 * Created by Trevor on 7/3/2015.
 */

var express = require("express");
var router = express.Router();
var Q = require('q');

router.route('/:username').get(function(req,res) {
    var logsService = require('../imp_services/displayLogs');
    var username = req.params.username;
    console.log("Username in getLogs " + username);
    logsService.displayLogs(username, function(logs) {

        res.end(logs);
    });

});

module.exports = router;