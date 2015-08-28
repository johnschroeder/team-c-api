/**
 * Created by johnschroeder on 8/13/15.
 */


var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 localhost:50001/Carts/InventoryByProductID/{ProductID}
 This route returns all carts that has a given user as assign AND all carts whose group assignee includes this user
 {Username}:
 */
router.route("/:ProductID").get(function(req, res) {
    //Q.longStackSupport = true;
    var db = require("../../imp_services/impdb.js").connect();

    /**
     *  Package up some values from the route
     */
    var productID = req.params.ProductID;
    var product = {availableByLocations: {locations: [], available: []}};

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL " + "GetProductByID(" + productID + ");"))
        .then(function (rows) {
            var productInfo = rows[0][0][0];
            product.productID = productID;
            product.name = productInfo.Name;
            product.description = productInfo.Description;

            Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("CALL " + "GetAllSizesByProductID(" + productID + ");"))
                .then(function (rows) {
                    product.sizes = rows[0][0];
                    Q.fcall(db.beginTransaction())
                        .then(db.query("USE " + db.databaseName))
                        .then(db.query("CALL " + "GetAllProductIDsLocationsAndQuantities()"))
                        .then(function (rows) {
                            var results = rows[0][0];
                            results.forEach(function (result) {
                                if (productID == result.ProductID) {
                                    product.availableByLocations.locations.push(result.Location);
                                    product.availableByLocations.available.push(result.TotalQuantityAvailable);
                                }
                            });
                            res.send(product);
                        })
                        .then(db.commit())
                        .then(db.endTransaction())
                        .catch(function (err) {
                            Q.fcall(db.rollback())
                                .then(db.endTransaction())
                                .done();
                            console.log("Error:");
                            console.error(err.stack);
                            send("ERROR: " + err.code);
                        })
                })
                .then(db.commit())
                .then(db.endTransaction())
                .catch(function (err) {
                    Q.fcall(db.rollback())
                        .then(db.endTransaction())
                        .done();
                    console.log("Error:");
                    console.error(err.stack);
                    send("ERROR: " + err.code);

                })
                .done();
        })
        .then(db.commit())
        .then(db.endTransaction())
        .catch(function (err) {
            Q.fcall(db.rollback())
                .then(db.endTransaction())
                .done();
            console.log("Error:");
            console.error(err.stack);
            send("ERROR: " + err.code);

        })
        .done();
});




module.exports = router;
