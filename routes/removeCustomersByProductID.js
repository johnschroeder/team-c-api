/**
 * Created by Elijah on 7/8/15.
 */
var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');

router.route("/:ProductID").get(function(req, res) {

    //Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();

    /**
     *  Package up some values from the route
     */
    var ProductID = req.params.ProductID;
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL removeCustomersByProductID" + "('" + ProductID + "');"))
        .then(function(){
            console.log("Success");
            res.send("Success");
        })
        .then(db.commit())
        .then(db.endTransaction())
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction());
            console.log("Error:");
            console.error(err.stack);
            res.status(503).send("ERROR: " + err.code);
        })
        .then(function() {
            require('../imp_services/implogging')(req.cookies.IMPId, function(logService){
                logService.action.productId = req.params.ProductID;
                logService.setType(1000);
                logService.store(function(err, results){
                    if (err) res.status(500).send(err);
                });
            });
        })
        .done();
});

module.exports = router;
