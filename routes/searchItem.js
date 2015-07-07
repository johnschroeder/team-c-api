var express = require("express");
var router = express.Router();
var Q = require('q');


router.route("/:name").get(function(req,res){

    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL GetAllInventory"))
        .then(function(rows){
            console.log("Success");
            var result = null;
            for( var i = 0; i < rows[0][0].length; ++i ){
                if( rows[0][0][i].ProductName == req.params.name ){
                    result = rows[0][0][i];
                    break;
                }
            }
            var invUnit = JSON.stringify(new Array(result));
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
