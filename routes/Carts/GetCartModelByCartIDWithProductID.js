/**
 * Created by johnschroeder on 7/19/15.
 */

var express = require("express");
var router = express.Router();
var Q = require('q');

/*
 Usage:
 TODO: write this.
 */

router.route("/:cartID/:productID").get(function(req, res) {

    //Q.longStackSupport = true;

    var db = require("../../imp_services/impdb.js").connect();

    Array.prototype.uniqueProductIDs = function() {
        var unique = [];
        for (var i = 0; i < this.length; ++i) {
            var alreadyExists = false;
            for(var j = 0; j < unique.length; ++j) {
                if(unique[j].productID === this[i].productID) {
                    alreadyExists = true;
                }
            }
            if(!alreadyExists) {
                unique.push(this[i]);
            }
        }
        return unique;
    };

    Array.prototype.clean = function(deleteValue) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == deleteValue) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    };
    function line(number) {
        console.log("=================" + number + "=================");
    }
    var getModel = {

        model:{
            products:[],
            cartID:req.params.cartID
        },
        runIDList:[],

        getCartItems:function(callback) {
            var cartID = req.params.cartID;
            var productID = req.params.productID;
            Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("CALL " + "GetCartItemsByCartID(" + cartID + ");"))
                .then(function(rows){
                    var items = rows[0][0];
                    var products = getModel.model.products;
                    products.unshift({
                        productID:parseInt(productID),
                        items:[],
                        newProduct:true,
                        editing: true,
                        colorsInUse: {
                            blue:false, red:false, green:false, yellow:false,
                            purple:false, orange:false, cyan:false, pink:false
                        },
                        totalAvailable: 0,
                        availableByLocations: {locations:[], available:[], runIDsAlreadyAdded:[]}
                    });
                    var uniqueItems = items.uniqueProductIDs();
                    var waitingOn = uniqueItems.length;
                    uniqueItems.forEach(function(item) {
                        line(69);
                        if (products[item.productID] === undefined) {
                            products[item.productID] = {
                                productID: item.productID,
                                items: [],
                                newProduct:false,
                                editing: false,
                                colorsInUse: {
                                    blue:false, red:false, green:false, yellow:false,
                                    purple:false, orange:false, cyan:false, pink:false
                                },
                                totalAvailable: 0,
                                availableByLocations: {locations:[], available:[], runIDsAlreadyAdded:[]}
                            };
                            if(products[0] != null
                                    && products[0].productID === products[item.productID].productID
                                    && products[0].newProduct) {
                                delete products[0];
                                products[item.productID].editing = true;
                            }
                        }
                    });
                    items.forEach(function(item){
                        line(85);
                        item.dirty = false;
                        if(item.color != null
                            && !products[item.productID].colorsInUse[item.color.toLowerCase()]) {
                            products[item.productID].colorsInUse[item.color.toLowerCase()] = true;
                        }
                        products[item.productID].items.push(item);
                        getModel.runIDList.push(item.runID);
                    });
                    uniqueItems.forEach(function(item){
                        line(95);
                        getModel.getProductInfo(item.productID,function(){
                            --waitingOn;
                            if(waitingOn === 0) {
                                getModel.getAmountAvailable(callback);
                            }
                        });
                    });
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

        getProductInfo:function(productID, callback) {
            line(118);
            Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("CALL " + "GetProductByID(" + productID + ");"))
                .then(function(rows){
                    var products = getModel.model.products;
                    var product = products[productID];
                    var productInfo = rows[0][0][0];
                    product.productID = productID;
                    product.name = productInfo.Name;
                    product.description = productInfo.Description;
                    getModel.getSizesByProductID(productID, function(){
                        callback();
                    });
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

        getSizesByProductID:function(productID, callback) {
            Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("CALL " + "GetAllSizesByProductID(" + productID + ");"))
                .then(function(rows){
                    var products = getModel.model.products;
                    var product = products[productID];
                    product.sizes = rows[0][0];
                    callback();
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

        //TODO: Fix this method by actually hitting db here
        /*
        This erroneously makes the assumption that at least one item from each run is present.
        It pulls amount available from the cart items and calculates how much is available in each
        location using those values.
        The way it should work is:
        -go down the list of product ids and hit the db for each one
        -build array of locations
        -find amount of the product that's available at each location
        -add that into the array that parallels location
         */
        getAmountAvailable: function(callback) {
            var products = getModel.model.products;
            products.forEach(function(product){
                var items = product.items;
                items.forEach(function (item) {
                    var addToTotal = true;
                    var newLocation = true;

                    product.availableByLocations.locations.forEach(function (location) {
                        if (item.location === location) {
                            newLocation = false;
                        }
                    });

                    product.availableByLocations.runIDsAlreadyAdded.forEach(function (runID) {
                        if (item.runID === runID) {
                            addToTotal = false;
                        }
                    });

                    if (addToTotal && newLocation) {
                        product.availableByLocations.locations.push(item.location);
                        product.availableByLocations.available.push(item.availableQuantityInRun);
                        product.availableByLocations.runIDsAlreadyAdded.push(item.runID);
                    } else if (addToTotal) {
                        var index = product.availableByLocations.locations.indexOf(item.location);
                        product.availableByLocations.available[index] += item.availableQuantityInRun;
                        product.availableByLocations.runIDsAlreadyAdded.push(item.runID);
                    }
                });
            });
            products.forEach(function(product){
                product.availableByLocations.available.forEach(function(quantity){
                    product.totalAvailable += quantity;
                });
            });
            products.forEach(function(product){
                var locationArray = product.availableByLocations.locations;
                var availableArray = product.availableByLocations.available;
                var items = product.items;
                items.forEach(function (item) {
                    var index = locationArray.indexOf(item.location);
                    item.availableAtLocation = availableArray[index];
                });

            });

            getModel.finalCalculations(callback);


        },
        finalCalculations: function(callback) {
            getModel.model.products.sort(function(a, b){
                return a.productID - b.productID;
            });
            getModel.model.products.clean(null);
            callback();
        }

    };
    getModel.getCartItems(function(err){
        if(err) {
            res.send(err);
        } else {
            res.send(getModel.model);
        }
    });

});
module.exports = router;
