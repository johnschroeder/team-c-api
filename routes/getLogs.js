/**
 * Created by Trevor on 7/3/2015.
 */

var express = require("express");
var router = express.Router();
var Q = require('q');

router.route('/').get(function(req,res) {
    var logsService = require('../imp_services/displayLogs');


    logsService.displayLogs(req.cookies.IMPId, function (logs) {
        res.end(logs);
    });
});

module.exports = router;