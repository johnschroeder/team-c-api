##### Create database and tables #####
DROP DATABASE IF EXISTS dev_ImpDB;

CREATE DATABASE imp_db;

USE imp_db;

CREATE TABLE Permissions (
PermsID int AUTO_INCREMENT,
Perms int,
PRIMARY KEY (PermsID)
);
ALTER TABLE Permissions AUTO_INCREMENT = 601;

CREATE TABLE Users (
Username varchar(25),
FirstName varchar(100),
LastName varchar(100),
Email varchar(255),
PermsID int,
Password varchar(356),
Salt varchar(256),
DateCreated date,
PRIMARY KEY (Username),
FOREIGN KEY (PermsID) REFERENCES Permissions(PermsID)
);
ALTER TABLE Users AUTO_INCREMENT = 201;

CREATE TABLE UserGroups (
GroupName varchar(25),
Username varchar(25),
FOREIGN KEY (Username) REFERENCES Users(Username)
);

CREATE TABLE Customers (
CustomerID int AUTO_INCREMENT,
Name varchar(255),
DateCreated date,
PRIMARY KEY (CustomerID)
);
ALTER TABLE Customers AUTO_INCREMENT = 401;

CREATE TABLE Products (
ProductID int AUTO_INCREMENT,
Name varchar(255),
Description varchar(255),
DateCreated date,
PRIMARY KEY (ProductID)
);
ALTER TABLE Products AUTO_INCREMENT = 101;

CREATE TABLE ProdCustMap (
ProductID int,
CustomerID int,
FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

CREATE TABLE Piles (
PileID int AUTO_INCREMENT,
ProductID int,
Location varchar(50),
PRIMARY KEY (PileID),
FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
ON DELETE CASCADE
);
ALTER TABLE Piles AUTO_INCREMENT = 301;

CREATE TABLE Runs (
RunID int AUTO_INCREMENT,
PileID int,
DateCreated date,
InitialQuantity int unsigned,
QuantityAvailable int unsigned,
QuantityReserved int unsigned,
InitialQuantity int unsigned,
PRIMARY KEY (RunID),
FOREIGN KEY (PileID) REFERENCES Piles(PileID)
ON DELETE CASCADE
);
ALTER TABLE Runs AUTO_INCREMENT = 501;

CREATE TABLE RunMarkers (
RunID int,
Marker varchar(30),
FOREIGN KEY (RunID) REFERENCES Runs(RunID)
ON DELETE CASCADE
);

CREATE TABLE SizeMap (
SizeMapID int AUTO_INCREMENT,
ProductID int,
Name varchar(50),
Size int,
PRIMARY KEY (SizeMapID),
FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
ON DELETE CASCADE
);

CREATE TABLE Logs (
LogID int AUTO_INCREMENT,
LogType int,
ProductID int,
Username varchar(25),
CustomerID int,
Time datetime,
GenericVar int,
PRIMARY KEY (LogID),
FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
FOREIGN KEY (Username) REFERENCES Users(Username),
FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);
ALTER TABLE Logs AUTO_INCREMENT = 1001;

CREATE TABLE LogViewMap (
LogID int,
Username varchar(25),
FOREIGN KEY (LogID) REFERENCES Logs(LogID),
FOREIGN KEY (Username) REFERENCES Users(Username)
ON DELETE CASCADE
);

CREATE TABLE Cart (
CartID int AUTO_INCREMENT,
CartName varchar(40),
Reporter varchar(25),
Assignee varchar(25),
TimeCreated datetime,
DateToDelete datetime,
PRIMARY KEY (CartID),
FOREIGN KEY (Reporter) REFERENCES Users(Username)
);

CREATE TABLE CartItems(
CartItemID int AUTO_INCREMENT,
CartID int,
SizeMapID int,
Quantity int,
RunID int,
PRIMARY KEY (CartItemID),
FOREIGN KEY (CartID) REFERENCES Cart(CartID),
FOREIGN KEY (RunID) REFERENCES Runs(RunID),
FOREIGN KEY (SizeMapID) REFERENCES SizeMap(SizeMapID)
);



