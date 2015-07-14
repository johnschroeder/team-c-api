/**
 * Created by Kun on 6/16/2015.
 */


var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 localhost:50001/Carts/DeleteItemInCart/{CartItemID}
 {CartItemID}: The ID of the CartItem to be deleted
 */
router.route("/:CartItemID").get(function(req, res) {

    //Q.longStackSupport = true;

    var db = require("../../imp_services/impdb.js").connect();

    /**
     *  Package up some values from the route
     */
    var CartItemID = req.params.CartItemID;

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("set @m='';"))
        .then(db.query("CALL " + db.spDeleteItemInCart + "( "+ CartItemID +","+"@m" +")"))
        .then(db.commit())
        .then(db.endTransaction())
        .then(function(){
            console.log("Successfully deleted cart item " + CartItemID);
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
        .then(function() {
            require('../../imp_services/implogging')(req.cookies.IMPId, function(logService){
                logService.action.cartItemId = CartItemID;
                logService.setType(1500);
                logService.store(function(err, results){
                    if(err){
                        res.status(500).send(err);
                    } else {
                        console.log("Successfully logged deletion of cart item " + CartItemID);
                    }
                });
            });
        })
        .done();
});

module.exports = router;
