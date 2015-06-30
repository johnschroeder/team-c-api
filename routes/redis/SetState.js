/**
 * Created by Kun on 6/28/2015.
 */

//http://www.sitepoint.com/using-redis-node-js/


var express = require("express");
var Q = require('q');
var router = express.Router();
var redis = require('redis');
var config = require("konfig")();

var port=config.app.redis.port;
var host=config.app.redis.host;

var client = redis.createClient(port,host);


router.route('/:cookie/:username/:LastPage').get(function(req, res) {
    //client.set(req.params.cookie, req.params.LastPage,function (error, result) {
    client.hmset(req.params.cookie,"Username",req.params.username,"LastPage" ,req.params.LastPage,function (error, result) {
        if (error !== null) {
            console.log("error: " + error);
            res.send("error: " + error);
        }
        else {
            console.log("Success");
            console.log("This is our redis cookie " + req.params.cookie);
            res.send("Success");
        }
    });
});

module.exports = router;