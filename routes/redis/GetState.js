/**
 * Created by Kun on 6/28/2015.
 */



var express = require("express");
var Q = require('q');
var router = express.Router();

impredis = require("../../imp_services/impredis.js");

router.route('/').get(function(req, res) {
    impredis.get(req.cookies.IMPId, function (error, val) {
        if (err) {
            res.send("error: " + error);
        }
        else {
            res.send(val.stateObject);
        }
    })
    });

module.exports = router;

