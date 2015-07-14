var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 http://localhost:50001/Carts/EditCart/6/"Cart1"/"test01"/"aaaa"/"2015-05-01"
 localhost:50001/Carts/EditCart/{CartID}/{CartName}/{Reporter}/{Assignee}/{DateToDelete}
 {CartID}: CartID of the cart to be edited
 {CartName}: The name of the cart being created
 {Reporter}: who build the cart
 {Assignee}: who has access to fill the cart
 {DateToDelete}: YYYY-MM-DD, when does the cart expire and deleted by nightly job
 NOTE: The MM field of {DateCreated} allows values from 0-12, which is a total of 13 months
 */
router.route("/:CartID/:CartName/:Reporter/:Assignee/:DateToDelete").get(function(req, res) {

    //Q.longStackSupport = true;

    var db = require("../../imp_services/impdb.js").connect();

    /**
     *  Package up some values from the route
     */
    var CartID = req.params.CartID;
    var CartName = req.params.CartName;
    var Reporter = req.params.Reporter;
    var Assignee = req.params.Assignee;
    var DateToDelete = req.params.DateToDelete;

    console.log(CartID);
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("UPDATE " + db.cartTable +
            " SET CartName = " + CartName + "," +
            " Reporter = " + Reporter + "," +
            " Assignee = " + Assignee + "," +
            " DateToDelete = " + DateToDelete +
            "WHERE CartID = " + CartID))
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
        .then(function() {
            require('../imp_services/implogging')(req.cookies.IMPId, function(logService){
                logService.action.cartId = CartID;
                logService.action.cartName = CartName;
                logService.setType(1300);
                logService.store(function(err, results){
                    if (err) res.status(500).send(err);
                });
            });

        })
        .done();
});

module.exports = router;
