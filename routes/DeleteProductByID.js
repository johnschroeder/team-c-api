var express = require("express");
var router = express.Router();
var Q = require('q');

router.route("/:productID").get(function(req,res){
    //Q.longStackSupport = true;
    var result;
    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL DeleteProductByID(" + req.params.productID+");"))
        .then(function(rows){
            var invUnit = JSON.stringify(rows[0][1]);
            result = rows[0][1][0].message;
            if (result === "Success") {
                console.log("Successfully deleted product " + req.params.productID);
            } else {
                console.log(result + " - cannot not delete");
            }
            res.send(invUnit);
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
        .then(function() {
            if (result === "Success") {
                require('../imp_services/implogging')(req.cookies.IMPId, function(logService){
                    logService.action.productId = req.params.productID;
                    logService.setType(1200);
                    logService.store(function(err, results){
                        if(err){
                            res.status(500).send(err);
                        } else {
                            console.log("Successfully logged deletion of product " + req.params.productID);
                        }
                    });
                });
            }
        })
        .done();
});

module.exports = router;
