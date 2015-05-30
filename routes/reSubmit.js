var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 localhost:50001/newProductSubmission/{Name}/{Customer}/{Description}/{DateCreated}
 {Name}: The name of the product being created
 {Customer}: The company the product is being produced for
 {Description}: High-level description of the product
 {DateCreated}: YYYY-MM-DD
 NOTE: The MM field of {DateCreated} allows values from 0-12, which is a total of 13 months
 */
router.route("/:ProductID/:customer/:productName/:description").get(function(req, res) {
    //Q.longStackSupport = true;

    var db = require("../imp_services/impdb.js").connect();
    var prodID= req.params.ProductID;

    var productName = mySQL.escape(req.params.productName);
    var customer = mySQL.escape(req.params.customer);
    var description = mySQL.escape(req.params.description);
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("UPDATE " + db.productTable + "SET Customer='" + customer +"', Description='" + description + "', Name='" + productName + " WHERE ProductID='" + prodID +"';"))

        .then(function(rows, columns){
            var deferred = Q.defer();
            //console.log(rows);
            deferred.resolve();
            return deferred.promise;
        })
        .then(db.commit())
        .then(db.endTransaction())
        .then(function(){
            console.log("Success");
            res.send("Success");
        })
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction())
                .done();
            console.log("Error:");
            console.error(err.stack);
            res.status(503).send("ERROR: " + err.code);
        })
        .done();
});

module.exports = router;
