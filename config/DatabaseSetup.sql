##### Create database and tables #####
DROP DATABASE IF EXISTS imp_db_dev;

CREATE DATABASE imp_db_dev;

USE imp_db_dev;

CREATE TABLE Permissions (
PermsID int unsigned AUTO_INCREMENT,
Perms int unsigned,
PRIMARY KEY (PermsID)
);
ALTER TABLE Permissions AUTO_INCREMENT = 601;

CREATE TABLE Users (
Username varchar(25),
FirstName varchar(100),
LastName varchar(100),
Email varchar(255),
PermsID int unsigned,
HP varchar(100),
US varchar(50),
DateCreated date,
isConfirmed bit(1) default 0,
PRIMARY KEY (Username),
FOREIGN KEY (PermsID) REFERENCES Permissions(PermsID)
);
ALTER TABLE Users AUTO_INCREMENT = 201;

CREATE TABLE UserGroups (
GroupName varchar(25),
Username varchar(25),
FOREIGN KEY (Username) REFERENCES Users(Username) ON DELETE CASCADE
);

CREATE TABLE Customers (
CustomerID int unsigned AUTO_INCREMENT,
Name varchar(255),
DateCreated date,
PRIMARY KEY (CustomerID)
);
ALTER TABLE Customers AUTO_INCREMENT = 401;

CREATE TABLE Products (
ProductID int unsigned AUTO_INCREMENT,
Name varchar(255),
Description varchar(255),
DateCreated date,
ViewOption int default 1,
PRIMARY KEY (ProductID)
);
ALTER TABLE Products AUTO_INCREMENT = 101;

CREATE TABLE ProdCustMap (
ProductID int unsigned,
CustomerID int unsigned,
FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE,
FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID) ON DELETE CASCADE
);

CREATE TABLE Piles (
PileID int unsigned AUTO_INCREMENT,
ProductID int unsigned,
Location varchar(50),
PRIMARY KEY (PileID),
FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
ALTER TABLE Piles AUTO_INCREMENT = 301;

CREATE TABLE Runs (
RunID int unsigned AUTO_INCREMENT,
PileID int unsigned,
DateCreated date,
InitialQuantity int unsigned,
QuantityAvailable int unsigned,
QuantityReserved int unsigned,
PRIMARY KEY (RunID),
FOREIGN KEY (PileID) REFERENCES Piles(PileID)
);
ALTER TABLE Runs AUTO_INCREMENT = 501;

CREATE TABLE RunMarkers (
RunID int unsigned,
Marker varchar(30),
FOREIGN KEY (RunID) REFERENCES Runs(RunID)ON DELETE CASCADE
);

CREATE TABLE SizeMap (
SizeMapID int unsigned AUTO_INCREMENT,
ProductID int unsigned,
Name varchar(50),
Size int unsigned,
PRIMARY KEY (SizeMapID),
FOREIGN KEY (ProductID) REFERENCES Products(ProductID)ON DELETE CASCADE
);

CREATE TABLE Logs (
LogID int unsigned AUTO_INCREMENT,
LogType int unsigned,
Username varchar(25),
Time datetime default NOW(),
ActionData varchar(2048),
PRIMARY KEY (LogID),
FOREIGN KEY (Username) REFERENCES Users(Username)
);

CREATE TABLE LogViewMap (
Username varchar(25),
LogID int unsigned,
FOREIGN KEY (LogID) REFERENCES Logs(LogID) ON DELETE CASCADE,
FOREIGN KEY (Username) REFERENCES Users(Username) ON DELETE CASCADE
);

CREATE TABLE Cart (
CartID int unsigned AUTO_INCREMENT,
CartName varchar(40),
Reporter varchar(25),
Assignee varchar(25),
TimeCreated datetime,
DateToDelete datetime,
PRIMARY KEY (CartID),
FOREIGN KEY (Reporter) REFERENCES Users(Username) ON DELETE SET NULL
);

CREATE TABLE CartItems(
CartItemID int unsigned AUTO_INCREMENT,
CartID int unsigned,
SizeMapID int unsigned,
Quantity int unsigned,
RunID int unsigned,
PRIMARY KEY (CartItemID),
FOREIGN KEY (CartID) REFERENCES Cart(CartID) ON DELETE CASCADE,
FOREIGN KEY (SizeMapID) REFERENCES SizeMap(SizeMapID) ON DELETE SET NULL,
FOREIGN KEY (RunID) REFERENCES Runs(RunID) ON DELETE SET NULL
);


ALTER TABLE SizeMap  ADD CONSTRAINT uq_SizeMap UNIQUE(ProductID, Size);
