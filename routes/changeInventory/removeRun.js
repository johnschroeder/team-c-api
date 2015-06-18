var express = require("express");
var Q = require('q');
var router = express.Router();
var L = require('../../imp_services/logging.js');


/*
 Usage:
 localhost:50001/changeInventory/removeRun/productId//pileId/runId
 */

router.route("/:productId/:pileId/:runId").get(function(req, res) {
    var db = require("../../imp_services/impdb.js").connect();

    //Q.longStackSupport = true;   // for error checking

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("DELETE from " + db.runTable  + " WHERE RunId = " + req.params.runId))
        .then(function(rows) {
            // check if database changed
            var deferred = Q.defer();
            if (rows[0].affectedRows == 0) {
                deferred.reject("Trying to remove run that doesn't exist");
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        })
        .then(L.updateLog(db, L.LOGTYPES.REMOVERUN.value, req.params.productId, null, null))
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