/**
 * Created by Trevor on 6/26/2015.
 */

var express = require("express");
var router = express.Router();
var Q = require('q');

router.route('/').post( function(req,res){
    var user_name=req.body.user;
    var password=req.body.password;
    console.log("From Client pOST request: User name = "+user_name+" and password is "+password);
    res.end("yes");
});

module.exports = router;

