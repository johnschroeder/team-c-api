var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 localhost:50001/Carts/GetInventoryAvailable/{ProductID}/{PileLocation}/{RunMarker}
 */
router.route("/:ProductID/:PileLocation/:RunMarker").get(function(req, res) {

    //Q.longStackSupport = true;
    var db = require("../../imp_services/impdb.js").connect();

    /**
     *  Package up some values from the route
     */
    var productId = req.params.ProductID;
    var pileLocation = req.params.PileLocation;
    var runMarker = req.params.RunMarker;
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL GetInventoryAvailable (" +  productId + ", '" + pileLocation + "', '" + runMarker + "'"  + ")"))
        .then(function(rows){
            console.log("Success:   " + JSON.stringify(rows[0][0]));
            var queryResult = JSON.stringify(rows[0][0]);
            res.send(queryResult);
        })
        .then(db.commit())
        .then(db.endTransaction())
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction());
            console.log("Error calling " + db.databaseName + " with GetInventoryAvailable.");
            console.error(err.stack);
            res.status(503).send("ERROR: " + err.code);
        })
        .done();
});

module.exports = router;
