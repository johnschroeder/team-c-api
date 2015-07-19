/**
 * Created by johnschroeder on 7/19/15.
 */

var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 */
router.route("/:cartID").get(function(req, res) {

    //Q.longStackSupport = true;

    var db = require("../../imp_services/impdb.js").connect();
    var getModel = {

        model:{
            products:[]
        },

        getProductInfo:function(productID) {
            Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("CALL " + "GetProductByID(" + productID + ");"))
                .then(function(rows){
                    var products = getModel.model.products;
                    products[productID] = {};
                    var product = products[productID];
                    var productInfo = rows[0][0][0];
                    product.productID = productID;
                    product.name = productInfo.Name;
                    product.description = productInfo.Description;
                    //res.send(getModel.model);
                    getModel.getSizesByProductID(productID);
                })
                .then(db.commit())
                .then(db.endTransaction())
                .catch(function(err){
                    Q.fcall(db.rollback())
                        .then(db.endTransaction())
                        .done();
                    console.log("Error:");
                    console.error(err.stack);
                    res.status(503).send("ERROR: " + err.code);

                })
                .done();
        },

        getSizesByProductID:function(productID) {
            Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("CALL " + "GetAllSizesByProductID(" + productID + ");"))
                .then(function(rows){
                    var products = getModel.model.products;
                    var product = products[productID];
                    product.sizes = rows[0][0];
                    res.send(getModel.model);
                    //getModel.getCartItems(productID);

                })
                .then(db.commit())
                .then(db.endTransaction())
                .catch(function(err){
                    Q.fcall(db.rollback())
                        .then(db.endTransaction())
                        .done();
                    console.log("Error:");
                    console.error(err.stack);
                    res.status(503).send("ERROR: " + err.code);

                })
                .done();
        },

        getCartItems:function(productID) {


        }

    };
    getModel.getProductInfo(101);

});
module.exports = router;
