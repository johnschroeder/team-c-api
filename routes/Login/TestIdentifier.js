var express = require("express");
var Q = require('q');
var router = express.Router();



/*
 Usage:
 www.thisisimp.com/login/testresetidentifier/:lookup
 */

router.route("/:lookup").get(function(req, res) {
    var result = require("../../imp_services/redislookup.js")(req.params.lookup, function(result){
        if(result){
            res.send(result);
        }
        else{
            res.status(500).send("Lookup not found");
        }
    });
});

module.exports = router;
