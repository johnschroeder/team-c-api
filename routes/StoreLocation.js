var express = require("express");
var router = express.Router();
var Q = require('q');
var crypto = require('crypto');
var uuid = require('node-uuid');

router.route('/:newLocationName').post( function(req,res){

    console.log("Storing Location");
    var newlocation=req.params.newLocationName;
console.log(newlocation);
    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL StoreLocation(\'" + newlocation + "\');"))
        .then(db.commit())
        .then(db.endTransaction())
        .then(res.end())
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
