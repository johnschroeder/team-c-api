/**
 * Created by Trevor on 6/26/2015.
 */

var express = require("express");
var router = express.Router();
var Q = require('q');
var crypto = require('crypto');
var uuid = require('node-uuid');

router.route('/').post( function(req,res){
    var user_name=req.body.user;
    var password=req.body.password;
    console.log("From Client pOST request: User name = "+user_name+" and password is "+password);

    var salt = 'ogMjWj33/pCEnBCogLYu0X+WLKOHaVjAWeZj/z/Zjpo=';
    var password = 'foobarbaz';
    var hash = crypto.createHash('sha256').update(password + salt).digest('hex');
    var oldhash = '4a53da2ab7f90b0b0db0e7ab879c23df466db950444a144f95ffd78bbc89950d';

    console.log("The hash is " + hash);
    if (hash == oldhash)
    {
        var cookie = uuid.v4();
        console.log("Hash match!");
        res.cookie('auth', cookie, { secure:false, maxAge: 60 * 1000, httpOnly: false });
        res.send("Hi " + req.cookies.auth);
        res.end('yes');
    }
    else
    {
        console.log("Hash not match!");
        res.end("Invalid Credentials!");
    }

});

module.exports = router;

