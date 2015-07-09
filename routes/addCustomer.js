/**
 * Created by johnschroeder on 7/7/15.
 */

var express = require("express");
var Q = require('q');
var router = express.Router();


/*
 Usage:
 localhost:50001/AddCustomer/customerName/
 */

router.route("/:customerName").get(function(req, res) {
    var db = require("../imp_services/impdb.js").connect();

    //Q.longStackSupport = true;   // for error checking

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL AddCustomer ('" + req.params.customerName + "')"))
        // TODO: log this entry?
        .then(function(rows, columns){
            console.log("Success");
            var customerID = JSON.stringify(rows[0][0][0]);
            res.send(customerID);
        })
        .then(db.commit())
        .then(db.endTransaction())
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction())
                .done();
            console.log("Error: " + err);
            //console.error(err.stack);
            res.status(503).send("ERROR: " + err);
        })
        .done();
});

module.exports = router;