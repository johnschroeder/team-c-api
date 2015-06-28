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
    var oldhash = 'd65cf2f6dad004d515d5ef2d41f7d99bf493e8dece1b17aacbc6c29a0e2fd00b';

    console.log("The hash is " + hash);
    if (hash == oldhash)
    {
        var cookie = uuid.v4();
        res.end(cookie);
        console.log("Hash match!");
    }
    else
    {
        console.log("Hash not match!");
        res.end("Invalid Credentials!");
    }

});

module.exports = router;

