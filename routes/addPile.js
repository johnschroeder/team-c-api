var express = require("express");
var Q = require('q');
var router = express.Router();
var L = require('../imp_services/logging.js');


/*
 Usage:
 localhost:50001/addPile/productId/location
 */

router.route("/:productId/:location").get(function(req, res) {
    var db = require("../imp_services/impdb.js").connect();

    //Q.longStackSupport = true;   // for error checking

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("INSERT INTO " + db.pileTable + " Values " + "(" + "NULL" + ", " + req.params.productId + ", " + req.params.location + ")"))
        .then(L.updateLog(db, L.LOGTYPES.ADDPILE.value, req.params.productId, null, null))
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
        .done();
});

module.exports = router;