var express = require("express");
var Q = require('q');
var router = express.Router();

impredis = require("../imp_services/impredis.js");

router.route('/').get(function(req, res) {
    var implogging = require('../imp_services/implogging');
    var db = require("../imp_services/impdb.js").connect();
    impredis.get(req.cookies.IMPId, function (val, error) {
        if (error) {
            res.send("error: " + error);
        }
        else {
            Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("SELECT FirstName, LastName, Email FROM Users WHERE username='"+val.username + "'"))
                .then(function(rows, columns){
                    res.send(rows[0])
                })
                .catch(function(err){
                    Q.fcall(db.rollback())
                        .then(db.endTransaction());
                    console.log("Error:");
                    console.error(err.stack);
                    res.status(503).send("ERROR: " + err.code);
                })
                .done();
        }
    })
});

module.exports = router;