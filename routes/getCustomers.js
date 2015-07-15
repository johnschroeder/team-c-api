/**
 * Created by johnschroeder on 7/7/15.
 */

var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 localhost:50001/GetCustomers
 This route returns all customers
 */
router.route("/").get(function(req, res) {

    //Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL GetCustomers()"))
        .then(function(rows, columns){
            console.log("Success");
            var customers = JSON.stringify(rows[0][0]);
            res.send(customers);
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
