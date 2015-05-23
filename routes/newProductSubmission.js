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
router.route("/:productName/:customer/:description/:date").get(function(req, res) {
    //TODO: Reconfigure so it doesn't require relative path
    var db = require("../imp_services/impdb.js").connect();

    var databaseName = db.databaseName;
    var tableName = db.productTable;
    var productName = req.params.productName;
    var customer = req.params.customer;
    var description = req.params.description;
    var date = req.params.date;
    var values = "(NULL, "
        + mySQL.escape(productName) + ", "
        + mySQL.escape(customer) + ", "
        + mySQL.escape(description) + ", "
        + mySQL.escape(date.toString()) + ")";

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + databaseName))
        .then(db.query("INSERT INTO " + tableName + " VALUES " + values))
        .then(db.commit())
        .then(db.endTransaction())
        .then(function(){
            console.log("Success");
            res.send("Success");
        })
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
