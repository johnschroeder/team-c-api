##### Create database and tables #####
DROP DATABASE IF EXISTS imp_db;

CREATE DATABASE imp_db;

USE imp_db;

CREATE TABLE Products (
ProductID int AUTO_INCREMENT,
Name varchar(255),
Customer varchar(255),
Description varchar(255),
DateCreated date,
PRIMARY KEY (ProductID)
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

ALTER TABLE Runs AUTO_INCREMENT=501;


CREATE TABLE Batches (
RunID int,
Amount float(10, 2),
Location varchar(100),
FOREIGN KEY (RunID) REFERENCES Runs(RunID)
ON DELETE CASCADE
);

ALTER TABLE BATCHES AUTO_INCREMENT=701;

##### Fill with sample data #####

INSERT INTO Products
VALUES (NULL, "Business Cards", "Mercy Corps", "Super slick business cards", "2015-05-03"),
	   (NULL, "PSU Stationary", "Portland State", "Letterhead and stationary for PSU", "2015-05-07"),
       (NULL, "Envelopes", "Warren", "Warren's customized capstone envelopes, 5 x 8", "2015-05-18"),
       (NULL, "IMP Display Board", "TeamC", "Project display board, 6 x 10", "2015-05-18");

INSERT INTO Runs
VALUES (NULL, 101, "2015-05-03"),
	   (NULL, 101, "2015-05-09"),
       (NULL, 102, "2015-05-08"),
       (NULL, 102, "2015-05-15"),
       (NULL, 103, "2015-05-18"),
       (NULL, 102, "2015-05-18");

INSERT INTO Batches
VALUES (501, 500, "A"),
	   (501, 500, "A"),
       (502, 1000, "B"),
       (503, 1500, "C"),
       (504, 1500, "C"),
       (504, 1500, "C"),
       (504, 1500, "C"),
       (504, 1500, "D"),
       (505, 55, "Z"),
       (506, 1500, "D");

####################################


##### The queries in this section are for display #####

# View Products table
SELECT *
FROM Products;

# View Runs table
SELECT *
FROM Runs;

# View Batches table
SELECT *
FROM Batches;

# View complete joined table
SELECT P.ProductID, P.Name, P.Customer, P.Description, P.DateCreated, R.RunID, R.Date AS RunDate, B.Amount AS BatchAmount, B.Location AS BatchLocation
FROM Products P LEFT OUTER JOIN Runs R ON P.ProductID = R.ProductID LEFT OUTER JOIN Batches B ON R.RunID = B.RunID;

####################################

##### Examples of deleting #####

# delete a product (will delete related runs and batches)
DELETE from Products
WHERE ProductID = 101;

# delete a run (will delete related batches)
DELETE from Runs
WHERE RunID = 502;

# delete a batch
DELETE from Batches
WHERE RunID = 501 AND Amount = 500 AND Location = "A"
Order by Amount ASC
limit 1;