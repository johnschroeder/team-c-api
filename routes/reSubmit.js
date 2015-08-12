var express = require("express");
var mysql = require("mysql");
var router = express.Router();
var Q = require('q');


router.route("/:ProductID/:productName/:description").get(function(req, res) {
    //Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    var prodID = mysql.escape(req.params.ProductID);
    var productName = mysql.escape(req.params.productName);
    var description = mysql.escape(req.params.description);
    //console.log("Call EditProductByID(" + prodID + ", " + productName + ", " + description + ");");
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("Call EditProductByID(" + prodID + ", " + productName + ", " + description + ");"))
        .then(function(rows){
            var affectedRows = rows[0].affectedRows;
            if (affectedRows == 1) {
                console.log("Successfully edited product " + req.params.ProductID);
                res.send("Success");
            } else {
                res.send("Error encountered while editing product " + req.params.ProductID);
            }
        })
        .then(db.commit())
        .then(db.endTransaction())
        .then(function() {
            require('../imp_services/implogging')(req.cookies.IMPId, function(logService){
                logService.action.productId = req.params.ProductID;
                logService.action.productName = req.params.productName;
                logService.setType(600);
                logService.store(function(err, results){
                    if (err) res.status(500).send(err);
                });
            });
        })
        .catch(function(err){
            console.log("Error: hit catch block in reSubmit.js");
            console.error(err.stack);
            res.status(503).send("ERROR: " + err.code);
        })
        .done();
});

module.exports = router;
