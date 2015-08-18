/**
 * Created by Kun on 6/16/2015.
 */

var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 localhost:50001/Carts/GetCartsByUser/{Username}
 This route returns all carts that has a given user as assign AND all carts whose group assignee includes this user
 {Username}:
 */
router.route('/').get(function(req, res) {

    //Q.longStackSupport = true;
    var db = require("../../imp_services/impdb.js").connect();

    /**
     *  Package up some values from the route
     */
    require("../../imp_services/impredis.js");
    impredis.get(req.cookies.IMPId, function (error, result) {
        console.log("result:");
        console.log(result);
        Q.fcall(db.beginTransaction())
            .then(db.query("USE " + db.databaseName))
            .then(db.query("CALL GetCartsByUser('" + result.username + "');"))
            .then(function(rows, columns){
                console.log("Success");
                var invUnit = JSON.stringify(rows[0][0]);
                res.send(invUnit);
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
});

module.exports = router;