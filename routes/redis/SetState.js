/**
 * Created by Kun on 6/28/2015.
 */

//http://www.sitepoint.com/using-redis-node-js/


var express = require("express");
var Q = require('q');
var router = express.Router();
var impredis = require("../../imp_services/impredis.js");


router.route('/:cookie/:username/:stateObject').get(function(req, res) {
    impredis.set(req.params.cookie, req.params.username, req.params.stateObject,function(result, error){
        if(error){
            res.send("error: " + error);
        }
        else{
            res.send("Success");
        }
    })
});

module.exports = router;