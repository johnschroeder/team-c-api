var express = require("express");
var Q = require('q');
var router = express.Router();


/*
 Usage:
 addRun - localhost:50001/changeInventory/addRun/inventoryId/runDate
 */

router.route("/:inventoryId/:runDate").get(function(req, res) {
    changeInventory(req, res);
});


function changeInventory(req, res) {
    var db = require("../../imp_services/impdb.js").connect();

    //Q.longStackSupport = true;   // for error checking

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("INSERT INTO " + db.runTable + " Values " + "(NULL, " + req.params.inventoryId + ", " + req.params.runDate + ") "))
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
}

module.exports = router;