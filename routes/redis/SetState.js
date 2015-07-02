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
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');



router.route('/:StateObj').get(function(req, res) {
    client.set(req.params.cookie, req.params.StateObj,function (error, result) {
    //client.hmset(req.params.cookie,"Username",req.params.username,"LastPage" ,req.params.LastPage,function (error, result) {
        if (error !== null) {
            console.log("error: " + error);
            res.send("error: " + error);
        }
        else {
            console.log("Success");
            res.send("Success");
        }
    });
});

module.exports = router;