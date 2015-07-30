var express = require("express");
var router = express.Router();
var Q = require('q');
var crypto = require('crypto');
var uuid = require('node-uuid');

router.route('/:productID').get(function(req,res){

    var productID =  req.params.productID;
    console.log("Started looking up location.");
    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL GetInventoryLocations(" + productID + ");"))
        .then(function(row) {

            // We got data about the user
            if (row[0][0].length == 0) { // No user by that username
                res.end("Invalid Credentials!");
            }
            else {
                var locations = [];
                for (var i = 0; i < row[0][0].length; i++)
                {
                    //console.log(row[0][0][i].location);
                    locations.push(row[0][0][i].Location);
                }

                var sendLocations = {"locationList" : locations};
                //console.log ("Ok now we have this too " + sendLocations.locationList[0]);
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
