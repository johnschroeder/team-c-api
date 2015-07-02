/**
 * Created by Trevor on 6/28/2015.
 */
var express = require("express");
var router = express.Router();
var Q = require('q');

router.route("/").get(function(req,res){
    console.log("Cookies " + req.cookies);
    console.log("Cookies length " + req.cookies.length);
    console.log(req.cookies.auth);
    res.end("Hi");
});

module.exports = router;