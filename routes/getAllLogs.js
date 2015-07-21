var express = require("express");
var router = express.Router();
var Q = require('q');

router.route('/').get(function(req,res) {
    var logsService = require('../imp_services/displayAllLogs');


    logsService.displayLogs(function (logs) {
        res.end(logs);
    });
});

module.exports = router;