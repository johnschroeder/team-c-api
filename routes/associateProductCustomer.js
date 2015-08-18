/**
 * Created by johnschroeder on 7/7/15.
 */

var express = require("express");
var Q = require('q');
var router = express.Router();


/*
 Usage:
 localhost:50001/associateProductCustomer/productID/customerID/
 */

router.route("/:productID/:customerID").get(function(req, res) {
    var db = require("../imp_services/impdb.js").connect();

    //Q.longStackSupport = true;   // for error checking

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL AssociateProductCustomer ('" + req.params.productID + "','" + req.params.customerID + "')"))
        // TODO: log this entry?
        .then(function(){
            console.log("Success");
            res.send("Success");
        })
        .then(db.commit())
        .then(db.endTransaction())
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction())
                .done();
            console.log("Error: " + err);
            res.status(503).send("ERROR: " + err);
        })
        // this log isn't all that helpful as all customers are removed and then re-added when a product is edited
        //.then(function() {
        //    require('../imp_services/implogging')(req.cookies.IMPId, function(logService){
        //        logService.action.productId = req.params.productID;
        //        logService.action.customerId = req.params.customerID;
        //        logService.setType(500);
        //        logService.store(function(err, results){
        //            if (err) res.status(500).send(err);
        //        });
        //    });
        //})
        .done();
});

module.exports = router;
