var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 localhost:50001/Carts/DeleteCart/{CartID}
 {CartID}: The ID of the Cart to be deleted
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
        .then(db.query("CALL DeleteCart" + "( "+ CartID +")"))
        .then(function(rows){
            var flag = false;
            if (rows[0].affectedRows != 0) { // check if database changed
                rows[0].forEach(function (item) { // check that each item in cart was deleted successfully
                    //console.log(item[0]);
                    if (item[0] != null && item[0].Result != null && item[0].Result != "Success") {
                        console.log("Error in DeleteCart.js");
                        flag = true;
                    }
                });
            } else { // nothing was deleted
                flag = true;
            }
            if (flag) {
                res.send("Error");
            } else {
                res.send("Success");
            }
        })
        .then(db.commit())
        .then(db.endTransaction())
        .then(function() {
            require('../../imp_services/implogging')(req.cookies.IMPId, function(logService){
                logService.action.cartId = CartID;
                logService.setType(1600);
                logService.store(function(err, results){
                    if(err){
                        res.status(500).send(err);
                    } else {
                        console.log("Successfully logged deletion of job " + CartItemID);
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
