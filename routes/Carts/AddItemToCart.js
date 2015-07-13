var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 localhost:50001/Carts/AddItemToCart/{CartID}/{SizeMapID}/{Quantity}/{RunID}
 {CartID}: The ID of the cart being added to
 {SizeMapID}: grouping size for this item
 {Quantity}: NOTE:?This quantity is the number of GROUPINGS (ie. 3 boxes), NOT the total quantity.
 {RunID}: which run to reserve from
 */
router.route("/:CartID/:SizeMapID/:Quantity/:RunID").get(function(req, res) {

    //Q.longStackSupport = true;

    var db = require("../../imp_services/impdb.js").connect();

    /**
     *  Package up some values from the route
     */
    var CartID = req.params.CartID;
    var SizeMapID = req.params.SizeMapID;
    var Quantity = req.params.Quantity;
    var RunID = req.params.RunID;

    // variables for logging
    var logCartName;
    var logProductId;
    var logAmount;

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("set @m='';"))
        .then(db.query("CALL " + db.spAddItemToCart + "("
            + CartID + ", "
            + SizeMapID + ", "
            + Quantity + ", "
            + RunID + "," + "@m);"
        ))
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
        // get information for logging, then log action
        .then(function() {
            var deferred = Q.defer();

            Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("CALL GetCartLogInfo(" + CartID + ", " + SizeMapID + ", " + Quantity + ")"))
                .then(function(rows) {
                    logCartName = rows[0][0][0].CartName;
                    logProductId = rows[0][0][0].ProductID;
                    logAmount = rows[0][0][0].Amount;
                })
                .then(db.commit())
                .then(db.endTransaction())
                .catch(function(err) {
                    Q.fcall(db.rollback())
                        .then(db.endTransaction())
                        .done();
                    console.log("Error:");
                    console.error(err.stack);
                })
                .then(function() {
                    require('../../imp_services/implogging')(req.cookies.IMPId, function(logService){
                        logService.action.productId = logProductId;
                        logService.action.cartName = logCartName;
                        logService.action.amount = logAmount;
                        logService.setType(300);
                        logService.store(function(err, results){
                            if(err){
                                res.status(500).send(err);
                            } else {
                                console.log("Successfully logged items being added to cart.")
                            }
                        });
                    });
                })
                .done();

            deferred.resolve();
            return deferred.promise;
        })
        .done();
});

module.exports = router;
