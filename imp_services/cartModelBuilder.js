/**
 * Created by johnschroeder on 7/19/15.
 */

var Q = require('q');

/*
 Usage:
 TODO: write this.
 */

exports.buildCart = function(cartID, productID, send) {
    console.log(cartID);
    console.log(productID);

    //Q.longStackSupport = true;

    var db = require("./impdb.js").connect();

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
        //productID:

        model:{
            products:[],
            cartID:cartID
        },
        runIDList:[],

        getCartItems:function(callback) {
            Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("CALL " + "GetCartItemsByCartID(" + cartID + ");"))
                .then(function(rows){
                    var items = rows[0][0];
                    if(productID == null) {
                        if (items.length == 0) {
                            callback("empty");
                        }
                    }
                    var products = getModel.model.products;
                    if(productID != null) {
                        products.unshift({
                            productID: parseInt(productID),
                            items: [{productID: productID}],
                            newProduct: true,
                            editing: true,
                            colorsInUse: {
                                blue: false, red: false, green: false, yellow: false,
                                purple: false, orange: false, cyan: false, pink: false
                            },
                            totalAvailable: 0,
                            availableByLocations: {locations: [], available: [], runIDsAlreadyAdded: []}
                        });
                    }
                    var uniqueItems = items.uniqueProductIDs();
                    var waitingOn = uniqueItems.length;
                    uniqueItems.forEach(function(item) {
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
                                availableByLocations: {locations:[], available:[]}
                            };
                            if(productID != null) {
                                if (products[0] != null
                                    && products[0].productID == products[item.productID].productID
                                    && products[0].newProduct) {
                                    delete products[0];
                                    products[item.productID].editing = true;
                                }
                            }
                        }
                    });
                    items.forEach(function(item){
                        item.dirty = false;
                        if(item.color != null
                            && !products[item.productID].colorsInUse[item.color.toLowerCase()]) {
                            products[item.productID].colorsInUse[item.color.toLowerCase()] = true;
                        }
                        products[item.productID].items.push(item);
                        getModel.runIDList.push(item.runID);
                    });
                    uniqueItems.forEach(function(item){
                        getModel.getProductInfo(item.productID,function(){
                            --waitingOn;
                            if(waitingOn == 0) {
                                if(productID != null) {
                                    getModel.getProductInfo(productID, getModel.getAllLocations(callback));
                                } else {
                                    getModel.getAllLocations(callback);
                                }
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
                    send("ERROR: " + err.code);
                })
                .done();
        },
        //TODO: Need versions of these two methods that affect index 0 in products array
        //TODO: They need to package these up with exactly the same data but not index into the array
        //TODO: At productID

        //TODO: The new plan is to just build an item with an associated product with all the data in
        //TODO: the cartitemid should be -1
        //

        getProductInfo:function(productID, callback) {
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
                    send("ERROR: " + err.code);

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
                    send("ERROR: " + err.code);

                })
                .done();
        },

        getAllLocations: function(callback) {
            Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("CALL " + "GetAllProductIDsLocationsAndQuantities()"))
                .then(function(rows) {
                    var results = rows[0][0];
                    var products = getModel.model.products;
                    results.forEach(function(result){
                        if(products[result.ProductID] !== undefined) {
                            products[result.ProductID].availableByLocations.locations.push(result.Location);
                            products[result.ProductID].availableByLocations.available.push(result.TotalQuantityAvailable);
                        }
                        else if(productID !== undefined
                            && products[0] !== undefined
                            && products[0].productID === result.ProductID) {
                            products[0].availableByLocations.locations.push(result.Location);
                            products[0].availableByLocations.available.push(result.TotalQuantityAvailable);
                        }
                    });
                    getModel.finalCalculations(callback);
                })
                .then(db.commit())
                .then(db.endTransaction())
                .catch(function(err) {
                    Q.fcall(db.rollback())
                        .then(db.endTransaction())
                        .done();
                    console.log("Error:");
                    console.error(err.stack);
                    send("ERROR: " + err.code);
                })
        },

        finalCalculations: function(callback) {
            var products = getModel.model.products;
            products.forEach(function(product) {
                product.availableByLocations.available.forEach(function(quantity) {
                    product.totalAvailable += quantity;
                });
            });
            products.sort(function(a, b){
                return a.productID - b.productID;
            });
            products.clean(null);
            callback();
        }

    };
    getModel.getCartItems(function(err){
        if(err) {
            //send(err);
        } else {
            send(getModel.model);
        }
    });

};
