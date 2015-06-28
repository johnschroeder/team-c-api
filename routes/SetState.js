/**
 * Created by Kun on 6/28/2015.
 */


var express = require("express");
var Q = require('q');
var router = express.Router();


router.get('/SetState/:cookie/:username', function(req, res) {
    client.set(req.params.cookie, req.params.username, function (error, result) {
        if (error !== null) {
            console.log("error: " + error);
            res.send("error: " + error);
        }
        else {
            res.send("Success");
        }
    });
});






// Set a value
client.set("ck1", "yoyoyoyo", redis.print);
// Get the value back
client.get("string key", function (err, reply) {
    console.log(reply.toString());
});

//client.quit();