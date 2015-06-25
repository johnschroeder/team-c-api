/**
 * Created by John Schroeder on 6/24/2015.
 */

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
    var CartID = req.params.CartID;
    var CartItemID = req.params.CartItemID;
    var SizeMapID = req.params.SizeMapID;
    var Quantity = req.params.Quantity;
    var RunID = req.params.RunID;
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL " + db.spDeleteItemInCart + "( "+ CartItemID +","+"@m" +")"))
        .then(db.query("CALL " + db.spAddItemToCart + "("
            + CartID + ", "
            + SizeMapID + ", "
            + Quantity + ", "
            + RunID + "," + "@m);"
        ))
        .then(function(rows, columns){
            console.log("Made it through to results.");
            console.log(JSON.stringify(rows));
            var invUnit = JSON.stringify(rows[0]);
            res.send(invUnit);
            db.endTransaction();
        })
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction());
            console.log("Error:");
            console.error(err.stack);
            res.status(503).send("ERROR: " + err.code);
        })
        .done();
});

module.exports = router;
