var express = require("express");
var Q = require('q');
var router = express.Router();
var L = require('../imp_services/logging.js');


/*
 Usage:
 localhost:50001/addRun/productId/pileId/runDate/quantityAvailable
 */

router.route("/:productId/:pileId/:runDate/:quantAvail").get(function(req, res) {
    var db = require("../imp_services/impdb.js").connect();

    //Q.longStackSupport = true;   // for error checking

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("INSERT INTO " + db.runTable + " Values " + "(NULL, " + req.params.pileId + ", '" + req.params.runDate + "', " + req.params.quantAvail + ", " + req.params.quantAvail + ", " + "0" + ") "))
        .then(L.updateLog(db, L.LOGTYPES.ADDRUN.value, req.params.productId, null, req.params.quantAvail))
        .then(db.commit())
        .then(db.endTransaction())
        .then(function(){
            console.log("Successfully added new run");
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