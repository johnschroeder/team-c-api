/**
 * Created by Kun on 6/28/2015.
 */



var express = require("express");
var Q = require('q');
var router = express.Router();


router.route('/:cookie').get(function(req, res) {
    client.hgetall(req.params.cookie, function (error, val) {
        if (error !== null) {
            console.log("error: " + error);
            res.send("error: " + error);
        }
        else {
            console.log(val);
            res.send(val);
        }
    });
});

module.exports = router;