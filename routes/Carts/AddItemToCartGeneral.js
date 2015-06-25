var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 localhost:50001/Carts/AddItemToCartGeneral/{CartID}/{SizeMapID}/{Quantity}
 {CartID}: The ID of the cart being added to
 {SizeMapID}: grouping size for this item
 {Quantity}: NOTE: This quantity is the number of GROUPINGS (ie. 3 boxes), NOT the total quantity.
 */
router.route("/:CartID/:SizeMapID/:Quantity").get(function(req, res) {

    //Q.longStackSupport = true;

    var db = require("../../imp_services/impdb.js").connect();

    /**
     *  Package up some values from the route
     */
    var CartID = req.params.CartID;
    var SizeMapID = req.params.SizeMapID;
    var Quantity = req.params.Quantity;
    var result;
    var message;

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("set @m = '';"))
        .then(db.query("set @r = '';"))
        .then(db.query("CALL " + db.spAddItemToCartGeneral + "("
            + CartID + ", "
            + SizeMapID + ", "
            + Quantity + ", "
            + "@m, "
            + "@r);"
        ))
        .then(function(rows){
            var deferred = Q.defer();
            result = JSON.stringify(rows);
            // locate result from values returned
            var regex = /\[{"_Msg.*"}\]/;
            // makes result a string
            result = '' + regex.exec(result);
            result = result.replace(/\\/g, '');

            // separate message and result
            var messageRegex = /"_Msg":.*","/;
            var resultRegex = /"_RunInfo":.*/;
            message = '' + messageRegex.exec(result);
            result = '' + resultRegex.exec(result);

            // trim message and result
            message = message.replace(/"_Msg":"/, '');
            message = message.replace(/","/, '');
            result = result.replace(/"_RunInfo":"/, '');
            result = result.replace(/"}]/, '');
            result = '{"runInfo":' + result + '}';

            console.log("message: " + message);
            console.log("result: " + result);
            res.send(message + '####' + result);
            deferred.resolve();
            return deferred.promise;
        })
        .then(db.commit())
        .then(db.endTransaction())
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
