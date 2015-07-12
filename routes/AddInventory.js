var express = require("express");
var Q = require('q');
var router = express.Router();


/*
 Usage:
 localhost:50001/AddInventory/productId/quantity/location
 */

router.route("/:productId/:quantity/:location").get(function(req, res) {
    var db = require("../imp_services/impdb.js").connect();

    //Q.longStackSupport = true;   // for error checking

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL AddInventory (" + req.params.productId + ", " + req.params.quantity + ", '" + req.params.location + "')"))
        // TODO: log this entry?
        .then(db.commit())
        .then(db.endTransaction())
        .then(function(){
            console.log("Successfully added new inventory. Product: " + req.params.productId + ", Quantity: " + req.params.quantity + ", Location: " + req.params.location + ".");
            res.send("Success");
        })
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction())
                .done();
            console.log("Error: " + err);
            //console.error(err.stack);
            res.status(503).send("ERROR: " + err);
        })
        .then(function() {
            console.log("my cookie: " + req.cookies.IMPId);
            require('../imp_services/implogging')(req.cookies.IMPId, function(logService){
                logService.action.productId = req.params.productId;
                logService.action.quantity = req.params.quantity;
                logService.action.location = req.params.location;
                logService.setType(100);
                logService.store(function(err, results){
                    if(err){
                        res.status(500).send(err);
                    } else {
                        console.log("Successfully logged new inventory added.")
                    }
                });
            });
        })
        .done();
});

module.exports = router;