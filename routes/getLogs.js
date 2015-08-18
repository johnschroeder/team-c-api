var express = require("express");
var router = express.Router();
var Q = require('q');

router.route('/:filterParameters').get(function(req,res) {
    var logsService = require('../imp_services/displayLogs');

    var filters = req.params.filterParameters;
    logsService.displayLogs(false, filters, req.cookies.IMPId, function (logs) {
        res.send(logs);
    });
});

module.exports = router;
