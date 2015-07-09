var express = require("express");
var router = express.Router();
var Q = require('q');


router.route("/:name").get(function(req,res){

    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query(
    "select s1.Customer as Customer,s1.*,s2.RunID as LastRunID,s2.InitialQuantity as LastRunInitialQuantity "+
    "from "+
    "(select c.Name as Customer,p.ProductID, p.Name as ProductName, "+
    "sum(r.QuantityAvailable) as TotalQuantity, "+
    "max(r.DateCreated) as LastRunDate "+
    "from Runs r "+
    "join Piles pl on pl.PileID = r.PileID "+
    "join Products p on pl.ProductID = p.ProductID "+
    "join ProdCustMap pcm on pl.ProductID = pcm.ProductID "+
    "join Customers c on pcm.CustomerID = c.CustomerID "+
    "group by p.ProductID) as s1 "+
    "join "+
    "(select r2.InitialQuantity, r2.DateCreated,r2.RunID, s3.ProductID "+
    "from "+
    "(select Max(r.RunID) as RunID, pl.ProductID "+
    "from Runs r "+
    "join Piles pl "+
    "on r.PileID = pl.PileID "+
    "group by pl.ProductID) as s3 "+
    "join Runs r2 on r2.RunID = s3.RunID) as s2 "+
    "on s1.ProductID = s2.ProductID; "
    ))
        .then(function(rows){
            console.log(rows);
            var result = [];
            for( var i = 0; i < rows[0][0].length; ++i ){
                if( rows[0][0][i].Customer == req.params.name ){
                    result.push( rows[0][0][i] );
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
