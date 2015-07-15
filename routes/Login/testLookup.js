var express = require("express");
var Q = require('q');
var router = express.Router();
var impredis = require("../../imp_services/impredis.js");


/*
 Usage:
 www.thisisimp.com/login/testLookup/:lookup
 */

router.route("/:lookup").get(function(req, res) {
    impredis.get(req.params.lookup, function(error, result){
        if (error !== null) {
            res.status(500).send({type:"none"});
        }
        else {
            res.send(result);
        }
    });
});

module.exports = router;
