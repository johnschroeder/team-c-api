/**
 * Created by Trevor on 6/26/2015.
 */

var express = require("express");
var router = express.Router();
var Q = require('q');
var crypto = require('crypto');
var uuid = require('node-uuid');

router.route('/').post( function(req,res){

    var salt; //'ogMjWj33/pCEnBCogLYu0X+WLKOHaVjAWeZj/z/Zjpo=';
    var oldhash;  // '4a53da2ab7f90b0b0db0e7ab879c23df466db950444a144f95ffd78bbc89950d';

    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("set @m='';"))
        .then(db.query("CALL " + db.GetUserByUsername + "(" + username + "@m);"
        )).then(function(rows) { console.log(rows[0]); salt = rows[0].Salt; oldhash = rows[0].Password; });

    var username=req.body.user;
    var password=req.body.password;
    console.log("From Client pOST request: User name = "+username+" and password is "+password);
    console.log("Old hash = " + oldhash);
    var hash = crypto.createHash('sha256').update(password + salt).digest('hex');

    console.log("The hash is " + hash);
    if (hash == oldhash)
    {
        var cookie = uuid.v4();
        console.log("Hash match!");
        res.cookie('auth', cookie, { secure:false, maxAge: 60 * 1000, httpOnly: false });

        res.send("" + req.cookies.auth);
        res.end('yes');
    }
    else
    {
        console.log("Hash not match!");
        res.end("Invalid Credentials!");
    }

});

module.exports = router;

