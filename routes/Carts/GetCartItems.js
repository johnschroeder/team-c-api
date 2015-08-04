var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 localhost:50001/Carts/GetCartItems/{CartID}
 {CartID}: cartID of the cart you want to retrieve items for
*/

router.route("/:CartID").get(function(req, res) {

    //Q.longStackSupport = true;
    var db = require("../../imp_services/impdb.js").connect();
    var CartID = req.params.CartID;

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL " + db.spGetCartItems + "('" + CartID + "');"))
        .then(function (rows) {
            var queryResult = rows[0];
            res.send(queryResult);
        })
        .then(db.commit())
        .then(db.endTransaction())
        .catch(function (err) {
            Q.fcall(db.rollback())
                .then(db.endTransaction());
            console.log("Error in GetCartItems route.");
            console.error(err.stack);
            res.status(503).send("ERROR: " + err.code);
        })
        .done();
});

module.exports = router;
