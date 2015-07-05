/**
 * Created by Kun on 6/16/2015.
 */

var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 localhost:50001/Carts/GetCartItems/{CartID}
 {CartID}: which cart's items do you want to diplay

 return table column names
 CartItemID, ProductID, ProductName, PileID, Location, SizeMapID, SizeName, CountPerBatch, BatchCount, Total, id
 */
router.route("/:CartID").get(function(req, res) {

    //Q.longStackSupport = true;
    var db = require("../../imp_services/impdb.js").connect();

    /**
     *  Package up some values from the route
     */
    var CartID = req.params.CartID;
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL " + db.spGetCartItems + "('" + CartID + "');"))
        .then(function(rows, columns){
            console.log("Success");
            //console.log(JSON.stringify(rows));
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
