/**
 * Created by Kun on 6/28/2015.
 */

//http://www.sitepoint.com/using-redis-node-js/


var express = require("express");
var Q = require('q');
var router = express.Router();
var redis = require('redis');
var client = redis.createClient();//needs real host and port
//var client = redis.createClient(Real_port,real_Amazon_Host);


router.route('/:cookie/:username/:LastPage').get(function(req, res) {
    //client.set(req.params.cookie, req.params.LastPage,function (error, result) {
    client.hmset(req.params.cookie,"Username",req.params.username,"LastPage" ,req.params.LastPage,function (error, result) {
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