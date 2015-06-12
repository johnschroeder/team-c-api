var express = require("express");
var router = express.Router();
var Q = require('q');

var querys =[
    "Select a.ProductID, a.Description, c.Name FROM Products a, Customers c WHERE a.CustomerID = c.CustomerID"
]


router.route("/:selectedID").get(function(req,res){
    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    var selectedID  = req.params.selectedID;
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        //.then(db.query(querys))
        .then(db.query("CREATE TABLE IF NOT EXISTS " + db.productTable + " " + db.productFields + ";"))
        .then(db.query("SELECT * FROM "
        + db.productTable + " "
        + "WHERE " +selectedID + " = ProductID; "))
        .then(function(rows, columns){
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
