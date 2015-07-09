/**
 * Created by Kun on 6/28/2015.
 */

//http://www.sitepoint.com/using-redis-node-js/


var express = require("express");
var Q = require('q');
var router = express.Router();
impredis = require("../../imp_services/impredis.js");


//TODO Make sure navigation object stringifies and parses stateObject request and response
router.route('/:stateObject').get(function(req, res) {
    impredis.set(req.cookies.IMPId, "stateObject",req.params.stateObject,function(error, result){
        if(error){
            res.send("error: " + error);
        }
        else{
            res.send("Success");
            }
    })
});

module.exports = router;
