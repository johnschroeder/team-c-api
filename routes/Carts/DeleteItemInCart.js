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
        .then(db.query("CALL DeleteCartItem" + "( "+ CartItemID +")"))
        .then(function(rows){
            //console.log(rows[0][0][0].Result);
            if (rows[0][0][0].Result == 'Success') {
                console.log("Successfully deleted cart item " + CartItemID);
            } else {
                console.log("Unsuccessful in attempt to delete cartItem: " + CartItemID + ". " + rows[0][0][0].Result);
            }
            res.send(rows[0][0][0].Result);
        })
        .then(db.commit())
        .then(db.endTransaction())
        .then(function() {
            require('../../imp_services/implogging')(req.cookies.IMPId, function(logService){
                logService.action.cartItemId = CartItemID;
                logService.setType(1400);
                logService.store(function(err, results){
                    if(err){
                        res.status(500).send(err);
                    } else {
                        console.log("Successfully logged deletion of cart item " + CartItemID);
                    }
                });
            });
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
