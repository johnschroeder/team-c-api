var express = require("express");
var Q = require('q');
var router = express.Router();

impredis = require("../imp_services/impredis.js");

router.route('/:customer').get(function(req, res) {
    var implogging = require('../imp_services/implogging');
    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL GetProductsByCustomerName ('" + req.params.customer + "')"))
        .then(function(rows, columns){
            var response = rows;
            res.send( JSON.stringify(rows[0][0]) );
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
    .done();
});

module.exports = router;