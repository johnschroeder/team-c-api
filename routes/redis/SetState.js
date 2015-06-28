/**
 * Created by Kun on 6/28/2015.
 */


var express = require("express");
var Q = require('q');
var router = express.Router();


router.get('/redis/SetState/:cookie/:username/:page', function(req, res) {
    client.hmset(req.params.cookie,"Username",req.params.username,"Page" ,reg.params.page,function (error, result) {
        if (error !== null) {
            console.log("error: " + error);
            res.send("error: " + error);
        }
        else {
            console.log(res);
            res.send(res);
        }
    });
});

