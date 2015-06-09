##### Create database and tables #####
DROP DATABASE IF EXISTS imp_db;

CREATE DATABASE imp_db;

USE imp_db;

CREATE TABLE Users (
UserID int AUTO_INCREMENT,
Name varchar(255),
Email varchar(255),
PermissonLevel int,
Password varchar(100),
PRIMARY KEY (UserID)
);

ALTER TABLE Users AUTO_INCREMENT = 201;

CREATE TABLE Customers (
CustomerID int AUTO_INCREMENT,
Name varchar(255),
PRIMARY KEY (CustomerID)
);

ALTER TABLE Customers AUTO_INCREMENT = 401;

CREATE TABLE Products (
ProductID int AUTO_INCREMENT,
Name varchar(255),
CustomerID int,
Description varchar(255),
DateCreated date,
PRIMARY KEY (ProductID),
FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

ALTER TABLE Products AUTO_INCREMENT=101;

CREATE TABLE Runs (
RunID int AUTO_INCREMENT,
ProductID int,
Date date,
PRIMARY KEY (RunID),
FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
ON DELETE CASCADE
);

ALTER TABLE Runs AUTO_INCREMENT=301;


CREATE TABLE Batches (
RunID int,
Amount int,
Location varchar(100),
FOREIGN KEY (RunID) REFERENCES Runs(RunID)
ON DELETE CASCADE
);

CREATE TABLE Logs (
LogID int AUTO_INCREMENT,
LogType int,
ProductID int,
UserID int,
CustomerID int,
Time datetime,
GenericVar int,
PRIMARY KEY (LogID),
FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
FOREIGN KEY (UserID) REFERENCES Users(UserID),
FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

ALTER TABLE Logs AUTO_INCREMENT = 1001;


##### Fill with sample data #####

## Users(UserID, Name, Email, PermissionLevel, Password) ##
INSERT INTO Users
VALUES (NULL, "Rick", "rick@gmail.com", null, "rickster"),
	   (NULL, "Kelly", "kgirl22@yahoo.com", null, "password"),
       (NULL, "Donovan", "dman@hotmail.com", null, "donovan"),
       (NULL, "Han Solo", "igosolo@pdx.edu", null, "fuzzball");

## Customers(CustomerID, Name) ##
INSERT INTO Customers
VALUES (NULL, "Mercy Corps"),
	   (NULL, "Great Business"),
       (NULL, "Sweet Shoes"),
       (NULL, "Poster Professionals");

## Proudcts(ProductID, Name, Customer, Description, DateCreated) ##
INSERT INTO Products
VALUES (NULL, "Business Cards", 401, "Super slick business cards", "2015-05-03"),
	   (NULL, "PSU Stationary", 402, "Letterhead and stationary for PSU", "2015-05-07"),
       (NULL, "Envelopes", 403, "Warren's customized capstone envelopes, 5 x 8", "2015-05-18"),
       (NULL, "IMP Display Board", 404, "Project display board, 6 x 10", "2015-05-18");

## Runs(RunID, ProductID, Date) ##
INSERT INTO Runs
VALUES (NULL, 101, "2015-05-03"),
       (NULL, 101, "2015-05-09"),
       (NULL, 102, "2015-05-08"),
       (NULL, 102, "2015-05-15"),
       (NULL, 103, "2015-05-18"),
       (NULL, 102, "2015-05-18");

## Batches(RunID, Amount, Location) ##
INSERT INTO Batches
VALUES (301, 500, "A"),
	   (301, 500, "A"),
       (302, 1000, "B"),
       (303, 1500, "C"),
       (304, 1500, "C"),
       (304, 1500, "C"),
       (304, 1500, "C"),
       (304, 1500, "D"),
       (305, 55, "Z"),
       (306, 1500, "D");

## Logs(LogID, LogType, ProductID, UserID, CustomerID, Date, GenericVar) ##
 INSERT INTO Logs
 VALUES (NULL, 100, 101, 201, 401, "2015-05-27 11:30:29", 100),
        (NULL, 200, 103, 202, 402, "2015-05-28 14:22:00", 1000),
        (NULL, 100, 102, 203, 401, "2015-05-29 13:25:44", 100),
		(NULL, 100, 102, 203, 401, "2015-05-29 13:33:56", 100);

####################################


##### The queries in this section are for display #####

## View Products table ##
SELECT *
FROM Products;

## View Runs table ##
SELECT *
FROM Runs;

## View Batches table ##
SELECT *
FROM Batches;

## View complete joined Product/Run/Batch table ##
SELECT P.ProductID, P.Name, P.CustomerID, P.Description, P.DateCreated, R.RunID, R.Date AS RunDate, B.Amount AS BatchAmount, B.Location AS BatchLocation
FROM Products P LEFT OUTER JOIN Runs R ON P.ProductID = R.ProductID LEFT OUTER JOIN Batches B ON R.RunID = B.RunID;

## View Users table ##
SELECT *
FROM Users;

## View Customers table ##
SELECT *
FROM Customers;

## View Logs table ##
SELECT *
FROM Logs;

## View complete joined Log table
SELECT L.LogID, L.LogType, P.Name AS ProductName, U.Name AS UserName, C.Name AS CustomerName, L.Time, L.GenericVar
FROM Logs L JOIN Products P ON L.ProductID = P.ProductID JOIN Customers C ON L.CustomerID = C.CustomerID JOIN Users U ON L.UserID = U.UserID;

####################################

##### Examples of deleting #####

## delete a product (will delete related runs and batches) ##
# DELETE from Products
# WHERE ProductID = 101;

## delete a run (will delete related batches) ##
# DELETE from Runs
# WHERE RunID = 502;

## delete a batch ##
# DELETE from Batches
# WHERE RunID = 501 AND Amount = 500 AND Location = "A"
# Order by Amount ASC
# limit 1;
