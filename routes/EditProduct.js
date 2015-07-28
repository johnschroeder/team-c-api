var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 localhost:50001/Carts/GetProductByID/ProductID
 */
router.route("/:ProductID").get(function(req, res) {

    //Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();

    /**
     *  Package up some values from the route
     */
    var ProductID = req.params.ProductID;
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL GetProductByID" + "('" + ProductID + "');"))
        .then(function(rows, columns){
            console.log("Success");
            var invUnit = JSON.stringify(rows[0][0]);
            res.send(invUnit);
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
        .done();
});

module.exports = router;