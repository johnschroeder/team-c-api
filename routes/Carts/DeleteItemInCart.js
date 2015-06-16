/**
 * Created by Kun on 6/16/2015.
 */


var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 localhost:50001/Carts/DeleteItemInCart/{CartItemID}
 {CartItemID}: The ID of the CartItem to be deleted
 */
router.route("/:CartItemID").get(function(req, res) {

    //Q.longStackSupport = true;

    var db = require("../../imp_services/impdb.js").connect();

    /**
     *  Package up some values from the route
     */
    var CartItemID = req.params.CartItemID;

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
        .then(db.query("set @m='';"))
        .then(db.query("CALL " + db.spDeleteItemInCart + "( "+ CartItemID +","+"@m" +")"))
        //.then(db.query("select @m;"))
    /**
     * The args here are results of the previous promise's wrapped function.
     * Note that I had to make the function in the then a promise by using the
     * defer() method to allow for further chaining.  This part is only necessary
     * if you need results from one of the wrapped method beyond success/failure.
     * Uncomment the console log to see that it's accessing values from the table
     */
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
