/**
 * Created by Kun on 6/28/2015.
 */



var express = require("express");
var Q = require('q');
var router = express.Router();
var impredis = require("../../imp_services/impredis.js");




router.route('/:cookie').get(function(req, res) {
    impredis.get(req.params.cookie, function(val, error){
        if(err){
            res.send("error: " + error);
        }
        else{
            res.send(val);
        }
    });
});

module.exports = router;