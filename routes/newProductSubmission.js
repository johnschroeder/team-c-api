 var mySQL = require("mysql");
 var express = require("express");
 var router = express.Router();
 var Q = require('q');
 var L = require('../imp_services/logging.js');
 /*
 Usage:
 localhost:50001/newProductSubmission/ProductName/Description/DateCreated
 ProductName: The name of the product being created
 Description: High-level description of the product
 DateCreated: YYYY-MM-DD
 NOTE: The MM field of {DateCreated} allows values from 0-12, which is a total of 13 months
 */
 router.route("/:productName/:description/:date").get(function(req, res) {
    /**
     * This is a really helpful line for getting good output out of promise errors.
     * The slowdown is significant though, so only use it when you have a problem.
     */
    //Q.longStackSupport = true;

    /**
     * This call returns the service
     * The function connect() ensures that each person who calls it
     * is given a unique connection to the database
     */
    var db = require("../imp_services/impdb.js").connect();

    /**
     *  Package up some values from the route
     */

    /**
     * The initial use of Q.fcall() is required to kickstart the chain.
     * Once that's done, the resulting object is a promise.
     * The promise contains a .then() method, which takes as its first (and usually only)
     * argument a function.
     * If the promise is fulfilled:
     *      There were no errors during the execution of the wrapped method
     *      The then() method's argument is called
     *          Arguments to the function inside then() are results of the previous promise!
     *          (see rows, columns from below)
     * If the promise was not fulfilled:
     *      There was an error during the execution of the wrapped method
     *      The error is passed on (or then's second argument is called)
     *      The error is used as an argument to .catch()'s function.
     * The .done() ends the chain.
     */
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL NewProduct('" + req.params.productName + "','" + req.params.description + "','" + req.params.date + "')"))
        .then(function(rows){
            console.log("Success");
            var productID = JSON.stringify(rows[0][0][0]);
            res.status(200);
            res.send(productID);
        })
        .then(db.commit())
        .then(db.endTransaction())
        .catch(function(err){
            console.log("err" + err);
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
