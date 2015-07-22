/**
 * Created by elijah on 7/21/15.
 */
var express = require("express");
var router = express.Router();
var Q = require('q');
var cookieParser = require('cookie-parser');
var impredis = require("../../imp_services/impredis.js");
express(cookieParser());
router.route('/:userName').get( function(req,res){
    var user = req.params.userName;
    impredis.delete(req.cookies.IMPId);
    require('../../imp_services/implogging')(req.cookies.IMPId, function(logService) {
        logService.action.user = user;
        logService.setType(901);
        logService.store(function (err, results) {
            if (err) res.status(500).send(err);
        });
    });
    impredis.exists(req.cookies.IMPId, function(err, reply) {
        if(reply == 1) {
            console.log("Failure");
        }
        else{
            res.send("Success!");
        }
    });

});

module.exports = router;
