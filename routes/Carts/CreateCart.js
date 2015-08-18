var mySQL = require("mysql");
var express = require("express");
var router = express.Router();
var Q = require('q');
/*
 Usage:
 localhost:50001/Carts/CreateCart/{CartName}/{Reporter}/{Assignee}/{DaysToDelete}
 {CartName}: The name of the cart being created
 {Reporter}: who build the cart
 {Assignee}: who has access to fill the cart
 {DateCreated}: YYYY-MM-DD
 {DaysToDelete}:how many days does the cart need to live
 NOTE: The MM field of {DateCreated} allows values from 0-12, which is a total of 13 months
 */
router.route("/:CartName/:Reporter/:Assignee/:DaysToDelete").get(function(req, res) {

    //Q.longStackSupport = true;

    var db = require("../../imp_services/impdb.js").connect();

    /**
     *  Package up some values from the route
     */
    var CartName = req.params.CartName;
    var Reporter = req.params.Reporter;
    var Assignee = req.params.Assignee;
    var DaysToDelete = req.params.DaysToDelete;
;


    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL CreateCart('"+CartName+"','"+Reporter+"','"+Assignee+"',"+DaysToDelete+");"))
        .then(function(rows){
            console.log("Successfully created new cart " + CartName);
            res.send(rows[0][0][0].CartID.toString());
        })
        .then(db.commit())
        .then(db.endTransaction())
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction())
                .done();
            console.log("Error:");
            console.error(err.stack);
            res.status(503).send("ERROR: " + err.code);

        })
        .then(function() {
            require('../../imp_services/implogging')(req.cookies.IMPId, function(logService){
                logService.action.cartName = CartName;
                logService.action.reporter = Reporter;
                logService.action.assignee = Assignee;
                logService.action.daysToDelete = DaysToDelete;
                logService.setType(700);
                logService.store(function(err, results){
                    if(err){
                        res.status(500).send(err);
                    } else {
                        console.log("Successfully logged new cart created.")
                    }
                });
            });
        })
        .done();
});

module.exports = router;
