/**
 * Created by Kun on 6/28/2015.
 */



var express = require("express");
var Q = require('q');
var router = express.Router();
var redis = require('redis');
var client = redis.createClient(); //needs real host and port
//var client = redis.createClient(Real_port,real_Amazon_Host);



router.route('/:cookie').get(function(req, res) {
    //client.get(req.params.cookie, function (error, val) {
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