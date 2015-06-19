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
    var productName = req.params.productName;
    var description = req.params.description;
    var date = req.params.date;
    var values = "(NULL, "
        + mySQL.escape(productName) + ", "
        + mySQL.escape(description) + ", "
        + mySQL.escape(date.toString()) + ")";

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
        .then(db.query("INSERT INTO " + db.productTable + " VALUES " + values))
    /**
     * The args here are results of the previous promise's wrapped function.
     * Note that I had to make the function in the then a promise by using the
     * defer() method to allow for further chaining.  This part is only necessary
     * if you need results from one of the wrapped method beyond success/failure.
     * Uncomment the console log to see that it's accessing values from the table
     */
        .then(function(rows){
            var deferred = Q.defer();
            //console.log(rows);
            deferred.resolve();
            return deferred.promise;
        })
        .then(L.updateLog(db, L.LOGTYPES.NEWPRODUCTCREATED.value, null, null, null))
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
