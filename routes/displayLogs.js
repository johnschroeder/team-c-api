var express = require("express");
var router = express.Router();
var Q = require('q');


router.route("/:after").get(function(req,res){

    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    var after = req.params.after;
    // console.log("after date " + after);
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CREATE TABLE IF NOT EXISTS " + db.batchTable + " " + db.batchFields + ";"))
        .then(db.query("CREATE TABLE IF NOT EXISTS " + db.runTable + " " + db.runFields + ";"))
        .then(db.query("CREATE TABLE IF NOT EXISTS " + db.productTable + " " + db.productFields + ";"))
        // .then(db.query("CREATE TABLE IF NOT EXISTS Logs (LogID int AUTO_INCREMENT PRIMARY KEY, LogType int, ProductID int, UserID INT, CustomerID INT, Time datetime, OtherVar INT, FOREIGN KEY (ProductID) REFERENCES Products(ProductID),  FOREIGN KEY (UserID) REFERENCES Users(UserID),  FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID));"))
        .then(db.query("SELECT l.LogType, l.Time, l.OtherVar, p.name, c.Name as CustomerName, u.name AS UserName, l.logID " +
    "FROM Logs l JOIN Products p ON p.productID = l.productID JOIN Customers c ON c.CustomerID = l.CustomerID " +
    "JOIN Users u on u.UserID = l.UserID "+
    "JOIN UserLogMap m on l.logID = m.logID WHERE m.UserID = 1;"))
        .then(function(rows, columns){
            console.log("Log Select Success");
            var logUnit = JSON.stringify(rows[0]);
            res.send(logUnit);
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
