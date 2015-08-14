var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 localhost:50001/Carts/EditCartItem/{CartID}/{CartItemID}/{SizeMapID}/{Quantity}/{RunID}
 {CartItemID}: which cart item do you want to edit
 {CartID}: cart to add back to
 {SizeMapID}: new value
 {Quantity}: new value
 {RunID}: new value
 */
router.route("/:CartID/:CartItemID/:SizeMapID/:Quantity/:RunID").get(function(req, res) {

    //Q.longStackSupport = true;
    var db = require("../../imp_services/impdb.js").connect();

    /**
     *  Package up some values from the route
     */
    var CartItemID = req.params.CartItemID;
    var CartID = req.params.CartID;
    var SizeMapID = req.params.SizeMapID;
    var Quantity = req.params.Quantity;
    var RunID = req.params.RunID;
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL " + db.spEditCartItem + "("
            + CartItemID + ", "
            + CartID + ", "
            + SizeMapID + ", "
            + Quantity + ", "
            + RunID + ");"
        ))
        .then(function(rows){
            console.log(JSON.stringify(rows[0][0]));
            var invUnit = JSON.stringify(rows[0][0]);
            res.send(invUnit);
        })
        .then(db.commit())
        .then(db.endTransaction())
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction());
            console.log("Error:");
            console.error(err.stack);
            res.status(503).send("ERROR: " + err.code);
        })
        .then(function() {
            require('../../imp_services/implogging')(req.cookies.IMPId, function(logService){
                logService.action.cartId = CartID;
                logService.action.cartItemId = CartItemID;
                logService.setType(1400);
                logService.store(function(err, results){
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        console.log("Successfully logged edit of cart item " + CartItemID + " in cart " + CartID);
                    }
                });
            });

        })
        .done();
});

module.exports = router;
