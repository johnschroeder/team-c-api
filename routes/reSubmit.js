var express = require("express");
var router = express.Router();
var Q = require('q');


router.route("/:ProductID/:customer/:productName/:description").get(function(req, res) {
    //Q.longStackSupport = true;
    //TODO escape the fieldthings so possible sql injection is avoided
    var db = require("../imp_services/impdb.js").connect();
    var prodID= req.params.ProductID;
    var productName = req.params.productName;
    var customer = req.params.customer;
    var description = req.params.description;
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("UPDATE " + db.productTable + " SET Customer='" + customer +"', Description='" + description + "', Name='" + productName + "' WHERE ProductID=" + prodID +";"))
        .then(function(rows, columns){
            console.log("Success");
            var invUnit = JSON.stringify(rows[0]);
            res.send(invUnit);
            console.log(invUnit);
            db.endTransaction();
        })
        .then(db.commit())
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
