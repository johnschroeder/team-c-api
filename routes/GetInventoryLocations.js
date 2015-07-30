var express = require("express");
var router = express.Router();
var Q = require('q');
var crypto = require('crypto');
var uuid = require('node-uuid');

router.route('/').get(function(req,res){

    console.log("Started looking up locations.");
    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL GetInventoryLocations();"))
        .then(function(row) {

            // We got data about the user
            if (row[0][0].length == 0) { // No user by that username
                res.end("Invalid Credentials!");
            }
            else {
                var locations = [];
                for (var i = 0; i < row[0][0].length; i++)
                {
                    locations.push(row[0][0][i].location);
                }

                var sendLocations = {"locationList" : locations};
                    res.send(JSON.stringify(sendLocations));
                res.end(JSON.stringify(sendLocations));
                }
            })
        .then(db.commit())
        .then(db.endTransaction())
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction())
                .then(console.log("We had an error") )
                .done();
            console.log("Error: " + err);
            res.status(503).send("ERROR: " + err);
        })
        .done();

});

module.exports = router;
