var express = require("express");
var Q = require('q');
var router = express.Router();
var redis = require('redis');
var config = require("konfig")();

var port=config.app.redis.port;
var host=config.app.redis.host;




router.route('/:lookup').post(function(req, res) {
    var client = redis.createClient(port,host);
    client.hgetall(req.params.lookup, function (error, val) {
        if (error !== null) {
            console.log("error: " + error);
            client.quit();
            res.send("error: " + error);
        }
        else {
            console.log(val);
            Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("UPDATE users SET isVerified=1 WHERE email='"+val.type+"'"))
                .then(db.commit())
                .then(db.endTransaction())
                .then(function(){
                    console.log("Success");
                    client.quit();
                    res.send("Success");
                })
                .catch(function(err){
                    client.quit();
                    console.log("Error: " + err);
                    Q.fcall(db.rollback())
                        .then(db.endTransaction())
                        .done();

                    res.status(503).send("ERROR: " + err);
                })
                .done();
        }
    });
});

module.exports = router;