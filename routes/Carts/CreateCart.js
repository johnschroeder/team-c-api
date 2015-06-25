/**
 * Created by Kun on 6/15/2015.
 */

var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 localhost:50001/Carts/CreateCart/{CartName}/{Reporter}/{Assignee}/{DaysToDelete}
 {CartName}: The name of the cart being created
 {Reporter}: who build the cart
 {Assignee}: who has access to fill the cart
 {DateCreated}: YYYY-MM-DD
 {DaysToDelete}:how many days does the cart need to live
 NOTE: The MM field of {DateCreated} allows values from 0-12, which is a total of 13 months
 */
router.route("/:CartName/:Reporter/:Assignee/:DaysToDelete").get(function(req, res) {

    //Q.longStackSupport = true;

    var db = require("../../imp_services/impdb.js").connect();

    /**
     *  Package up some values from the route
     */
    var CartName = req.params.CartName;
    var Reporter = req.params.Reporter;
    var Assignee = req.params.Assignee;
    var DaysToDelete = req.params.DaysToDelete;
;


    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL CreateCart('"+CartName+"','"+Reporter+"','"+Assignee+"',"+DaysToDelete+");"))
        .then(function(rows, columns){
            var deferred = Q.defer();
            //console.log(rows);
            deferred.resolve();
            return deferred.promise;
        })
        .then(db.commit())
        .then(db.endTransaction())
        .then(function(){
            console.log("Success");
            res.send("Success");
        })
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction())
                .done();
            console.log("Error:");
            console.error(err.stack);
            res.status(503).send("ERROR: " + err.code);

        })
        .done();
});

module.exports = router;
