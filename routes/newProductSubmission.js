 var mysql = require("mysql");
 var config = require("konfig")();
 var express = require("express");
 var Q = require("q");
 var router = express.Router();
 //TODO: Reconfigure so it doesn't require relative path
 var db = require("../imp_services/impdb.js").connect();

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
    Q.longStackSupport = true;
    var databaseName = db.databaseName;
    var connection = db.connection;

    var tableName = db.productTable;
    var tableFields = db.prodFields;

    var productName = req.params.productName;
    var customer = req.params.customer;
    var description = req.params.description;
    var date = req.params.date;
    var values = "(NULL, "
        + mysql.escape(productName) + ", "
        + mysql.escape(customer) + ", "
        + mysql.escape(description) + ", "
        + mysql.escape(date.toString()) + ")";

    var debug = db.beginTransaction();
    console.log(debug);
    debug
        .then(db.query("USE " + databaseName))
        .then(db.query("CREATE TABLE IF NOT EXISTS " + tableName + " " + tableFields))
        .then(db.query("INSERT INTO " + tableName + " VALUES " + values))
        .then(db.commit())
        .then(function() {
            res.send("Success");
        })
        //.then(db.endTransaction())
        .catch(function(err){
            //db.rollback();
            console.error(err.stack);
            res.status(503).send("ERROR: " + err.code);
        })
        .done();

});

module.exports = router;
