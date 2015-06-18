var express = require("express");
var router = express.Router();
var Q = require('q');


router.route("/").get(function(req,res){
    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("SELECT Pr.ProductID, Pr.Name, Pr.Description, Pi.PileID, Pi.Location, R.RunID, R.QuantityAvailable, R.QuantityReserved, R.DateCreated FROM "
            + db.pileTable + " Pi NATURAL JOIN "
            + db.runTable   + " R NATURAL JOIN "
            + db.productTable + " Pr "
        + "GROUP BY " + " Pr.ProductID, " + "Pi.PileID;"))
        .then(function(rows){
            console.log("Success");
            var invUnit = JSON.stringify(rows[0]);
            res.send(invUnit);
            db.endTransaction();
        })
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction());
            console.log("Error:");
            console.error(err.stack);
            res.status(503).send("ERROR: " + err.code);
        })
        .done();
});

module.exports = router;
