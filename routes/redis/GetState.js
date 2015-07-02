/**
 * Created by Kun on 6/28/2015.
 */



var express = require("express");
var Q = require('q');
var router = express.Router();
var redis = require('redis');
var config = require("konfig")();

var port=config.app.redis.port;
var host=config.app.redis.host;


var client = redis.createClient(port,host);


router.route('/').get(function(req, res) {
    client.get(req.cookies, function (error, val) {
    //client.hgetall(req.params.cookie, function (error, val) {
        if (error !== null) {
            console.log("error: " + error);
            res.send("error: " + error);
        }
        else {
            console.log(json.stringify(val));
            res.send(json.stringify(val));
        }
    });
});

module.exports = router;