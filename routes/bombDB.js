var express = require("express");
var router = express.Router();
var Q = require('q');

  /** BEFORE CHANGING ANYTHING HERE, MAKE SURE YOU UNDERSTAND THE RAMIFICATIONS!
 * THIS ROUTE DROPS THE SHARED DATABASE AND REPLACES IT WITH WHATEVER THE
 * SQL SCRIPT TELLS IT TO
  */

  //Enter query into this array:
  var dbChanger=
  [   "DROP DATABASE IF EXISTS dev_impDB;",
      "CREATE DATABASE dev_impDB;",
      "USE dev_impDB;",
      "CREATE TABLE Customers (CustomerID int AUTO_INCREMENT,Name varchar(255),Description varchar(255),DateCreated date,PRIMARY KEY (CustomerID));",
      "ALTER TABLE Customers AUTO_INCREMENT=100;",
      "CREATE TABLE Products (ProductID int AUTO_INCREMENT,Name varchar(255),CustomerID int,Description varchar(255),DateCreated date,PRIMARY KEY (ProductID),FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID));",
      "ALTER TABLE Products AUTO_INCREMENT=500;",
      "CREATE TABLE InventoryPiles (PileID int AUTO_INCREMENT,ProductID int,Location varchar(255),Quantity int,PRIMARY KEY (PileID),FOREIGN KEY (ProductID) REFERENCESProducts(ProductID));",
      "CREATE TABLE SizeMap (SizeMapID int AUTO_INCREMENT,ProductID int,SizeName varchar(255),SizeValue int,PRIMARY KEY (SizeMapID),FOREIGN KEY (ProductID)REFERENCES Products(ProductID));",
      "CREATE TABLE Runs (RunID int AUTO_INCREMENT,ProductID int,Quantity int,Location varchar(255),Date date,PRIMARY KEY (RunID),FOREIGN KEY (ProductID) REFERENCES Products(ProductID));",
      "INSERT INTO Customers VALUES (NULL, Mercy Corps, Company AAAAAAAAAAAAAA, 2015-05-03),(NULL, Portland State, Company BBBBBBBBB, 2015-05-07),(NULL, Warren, Company CCCCCCCCCCCCCCCCCCC, 2015-05-18),(NULL, TeamYOYOYO, Company DDDDDDDDDDDDDDD, 2015-05-18);",
      "INSERT INTO Products VALUES (NULL,  Business Cards ,100,  Super slick business cards ,  2015-05-03 ), (NULL,  PSU Stationary , 101,  Letterhead and stationary for PSU ,  2015-05-07 ),(NULL,  Envelopes , 102,  Warren's customized capstone envelopes, 5 x 8 ,  2015-05-18 ),(NULL,  IMP Display Board , 103,  Project display board, 6 x 10 ,  2015-05-18 );",
      "INSERT INTO InventoryPiles VALUES(NULL, 500,  LocationA ,3400), (NULL, 501,  LocationA ,900),(NULL, 500, LocationC ,9000),(NULL, 502,  LocationB ,4210);",
      "INSERT INTO  SizeMap VALUES (NULL, 500,  Batch ,500), (NULL, 500,  Subbatch ,100), (NULL, 501,  Batch ,300), (NULL, 501,  Subbatch ,50), (NULL, 502,  Batch , 100), (NULL, 502,  Subbatch ,10), (NULL, 503,  Batch , 1000);",
      "INSERT INTO  Runs VALUES (NULL, 500, 4000,  LocationA ,  2015-03-15  ), (NULL, 500, 4000,  LocationB ,  2015-02-02  ), (NULL, 502, 4000,  LocationD ,  2015-01-11  );"
  ]
router.route("/").get(function(req,res){
//    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    var selectedID  = req.params.selectedID;
    Q.fcall(db.beginTransaction())
        .then(db.query(dbChanger))
        .then(function(rows, columns){
            console.log("Success");
            var invUnit = JSON.stringify(rows[0]);
            res.send(invUnit);
            db.endTransaction();
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
