/**
 * Created by Trevor on 6/26/2015.
 */

var express = require("express");
var router = express.Router();
var Q = require('q');
var crypto = require('crypto');
var uuid = require('node-uuid');

router.route('/').post( function(req,res){

    // This is stub data, go ahead and remove everything after '=' for both when we're ready to merge.
    var salt = 'ogMjWj33/pCEnBCogLYu0X+WLKOHaVjAWeZj/z/Zjpo=';
    var oldhash = '21f29d37a7f076830f8dc4234c8c95cef70ec18d2e45f050121557ec12eaeb8c'; // donovan

    var username=req.body.user;
    var password=req.body.password;

    // These will be deleted.
    console.log("From Client pOST request: User name = "+username+" and password is "+password);
    console.log("Old hash = " + oldhash);

    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL GetUserByUsername(" + username + ");"))
        .then(function(rows) { console.log(JSON.stringify(rows[0][0])); console.log(rows[0]); salt = rows[0].US; oldhash = rows[0].HP; })
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction())
                .done();
            console.log("Error: " + err);
            //console.error(err.stack);
            res.status(503).send("ERROR: " + err);
        })
        .done();

    var hash = crypto.createHash('sha256').update(password + salt).digest('hex');

    // this will be deleted.
    console.log("The hash is " + hash);

    if (hash == oldhash)
    {
        var cookie = uuid.v4();
        console.log("Hash match!");
        res.cookie('auth', cookie, { secure:false, maxAge: 60 * 1000, httpOnly: false });

        res.send(cookie);
        res.end(cookie);
    }
    else
    {
        console.log("Hash does not match!");
        res.end("Invalid Credentials!");
    }

});

module.exports = router;

