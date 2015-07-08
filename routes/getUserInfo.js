var express = require("express");
var Q = require('q');
var router = express.Router();

impredis = require("../../imp_services/impredis.js");

router.route('/').get(function(req, res) {
    var impredis = require('../imp_services/implogging');
    impredis.get(req.cookies.IMPId, function (val, error) {
        if (error) {
            res.send("error: " + error);
        }
        else {
            Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("CALL GetUserInfo ('"+val.username+"')"))
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