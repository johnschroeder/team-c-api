/**
 * Created by elijah on 7/18/15.
 */
var express = require("express");
var router = express.Router();
var Q = require('q');


router.route("/:pageToHit/:Userperm").get(function(req,res){
    var page = req.params.pageToHit;
    var UserPerm = req.params.Userperm;
    console.log(page);
    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL CheckPermissions" + "('" + page + "'," + UserPerm + ");"))
        .then(function (rows, columns) {
            var result = rows[0][0][0];
            if (result.PermCheck == 1) {
                console.log("Access to route " + page + " granted!");
                res.send("Success");
            }
            else {
                console.log("Sorry, your permission level doesn't allow you to access this page.");
                res.status(511).send("Access Denied!");
            }
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