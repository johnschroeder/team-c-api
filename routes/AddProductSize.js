var express = require("express");
var Q = require('q');
var router = express.Router();


/*
 Usage:
 localhost:50001/addProductSize/productId/name/size
 */

router.route("/:productId/:name/:size").get(function(req, res) {
    var db = require("../imp_services/impdb.js").connect();

    //Q.longStackSupport = true;   // for error checking

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL AddProductSize (" + req.params.productId + ", '" + req.params.name + "', " + req.params.size + ")"))
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
            console.log("Error: " + err);
            //console.error(err.stack);
            res.status(503).send("ERROR: " + err);
        })
        .then(function() {
            require('../imp_services/implogging')(req.cookies.IMPId, function(logService){
                logService.action.productId = req.params.productId;
                logService.action.sizeName = req.params.name;
                logService.action.size = req.params.size;
                logService.setType(200);
                logService.store(function(err, results){
                    if (err) res.status(500).send(err);
                });
            });

        })
        .done();
});

module.exports = router;