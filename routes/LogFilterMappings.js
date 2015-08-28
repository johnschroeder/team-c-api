/**
 * Created by Trevor on 7/27/2015.
 */

var express = require("express");
var router = express.Router();
var Q = require('q');

router.route('/').get(function(req,res) {
    var logsService = require('../imp_services/displayLogs');


    logsService.getJsonFormLogMap(function (logPairs) {
        res.end(logPairs);
    });
});

module.exports = router;
