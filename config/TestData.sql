use imp_db_dev;
##### Fill with sample data #####

## Permissions(PermsID, Perms) ##
INSERT INTO Permissions
VALUES (NULL, 0);

## Users(Username, FirstName, LastName, Email, PermsID, HP, US, DateCreated) ##
INSERT INTO Users
VALUES ("rickgib", "Rick", "Gibbins", "rick@gmail.com", 601, "rickster", "1234", "2015-05-01"),
	   ("kellygirl", "Kelly", "Sazzle", "kgirl22@yahoo.com", 601, "password", "5678", "2015-06-09"),
       ("don", "Donovan", "DaMan", "dman@hotmail.com", 601, "donovan", "9101", "2015-05-25"),
       ("hansolo", "Han", "Solo", "igosolo@pdx.edu", 601, "fuzzball", "1121", "1977-05-25"),
       ('mvalenti', 'Michael', 'Valentine', 'namespace.valentine@gmail.com', 601, 'SHA256$2f8d863f$1$3bf52cc169f0e0258c3c871b65d1289952cbadec20db7dce4659e8894be3f816', 'ogMjWj33/pCEnBCogLYu0X+WLKOHaVjAWeZj/z/Zjpo=', curdate());

## UserGroups(GroupName, Username) ##
INSERT INTO UserGroups
VALUES ("Bosses", "hansolo"),
	   ("Other", "rickgib"),
       ("Other", "kellygirl"),
       ("Other", "don");

## Customers(CustomerID, Name, DateCreated) ##
INSERT INTO Customers
VALUES (NULL, "Mercy Corps", "2014-03-19"),
	   (NULL, "Great Business", "2011-11-29"),
       (NULL, "Sweet Shoes", "2015-06-16"),
       (NULL, "Poster Professionals", "1800-12-31");

## Products(ProductID, Name, Description, DateCreated) ##
INSERT INTO Products
VALUES (NULL, "Business Cards", "Super slick business cards", "2015-05-03", default),
	   (NULL, "PSU Stationary", "Letterhead and stationary for PSU", "2015-05-07", default),
       (NULL, "Envelopes", "Warren's customized capstone envelopes, 5 x 8", "2015-05-18", default),
       (NULL, "IMP Display Board", "Project display board, 6 x 10", "2015-05-18", default);

## ProdCustMap(ProductID, CustomerID) ##
INSERT INTO ProdCustMap
VALUES (101, 401),
	   (102, 402),
       (103, 402),
       (104, 404),
       (101, 403);

## Piles(PileID, ProductID, Location) ##
INSERT INTO Piles
VALUES (NULL, 101, "A-1"),
	   (NULL, 101, "B-1"),
       (NULL, 102, "C-1"),
       (NULL, 102, "C-2"),
       (NULL, 103, "F-1"),
       (NULL, 104, "Z-1"),
       (NULL, 104, "Z-2"),
       (NULL, 102, "D-1"),
       (Null, 104, "Z-3");

## Runs(RunID, PileID, DateCreated, InitialQuantity, QuantityAvailable, QuantityReserved) ##
INSERT INTO Runs
VALUES (NULL, 301, "2015-05-03", 1000, 800, 200, null),
       (NULL, 301, "2015-05-09", 2000, 1000, 0, null),
       (NULL, 302, "2015-05-08", 2000, 900, 100, null),
       (NULL, 302, "2015-05-15", 1000, 1000, 0, null),
       (NULL, 303, "2015-05-18", 1000, 500, 0, null),
       (NULL, 302, "2015-05-18", 600, 500, 50, null),
       (NULL, 304, "2015-05-18", 1500, 750, 250, null),
       (NULL, 305, "2015-05-18", 1500, 1000, 0, null),
       (NULL, 306, "2015-05-18", 4000, 2000, 2000, null),
       (NULL, 304, "2015-05-18", 500, 500, 0, null),
       (NULL, 307, "2015-05-18", 20000, 10000, 1000, null),
       (NULL, 309, "2015-05-18", 110, 100, 0, null);

## RunMarkers(RunID, Marker) ##
INSERT INTO RunMarkers
VALUES (501, "Blue"),
	   (502, "Green"),
       (503, "Blue"),
       (504, "Green"),
       (505, "Blue"),
       (506, "Red"),
       (507, "Blue"),
       (508, "Blue"),
       (509, "Blue"),
       (510, "Green"),
       (511, "Blue"),
       (512, "Yellow");

## SizeMap(SizeMapID, ProductID, Name, Size) ##
INSERT INTO SizeMap
VALUES (NULL, 101, "Batch", 100),
	   (NULL, 101, "Sub-batch", 35),
       (NULL, 102, "Handful", 5),
       (NULL, 102, "Bundle", 80),
       (NULL, 103, "Bucket", 47),
       (NULL, 104, "Grip", 2);

## Logs(LogID, LogType, Username, Time, ActionData) ##
INSERT INTO Logs
VALUES  (NULL, 400, 'don', default, NULL),
		(NULL, 100, 'hansolo', default, NULL),
        (NULL, 200, 'don', default, NULL),
        (NULL, 300, 'don', default, NULL),
        (NULL, 600, 'kellygirl', default, NULL),
        (NULL, 300, 'rickgib', default, NULL);

UPDATE Logs SET ActionData = "{\"value\":\"I\'m a json object?\"}"
WHERE LogID > 0;

## LogViewMap(Username, LogID) ##
INSERT INTO LogViewMap
VALUES  ('don', 1),
		('hansolo', 3),
        ('kellygirl', 2),
        ('don', 2),
        ('don', 3);

## Carts(CartID, CartName, Reporter, Assignee, TimeCreated, DateToDelete) ##
INSERT INTO Cart
VALUES (null,"cart1","don","Other","2015-02-01", "2015-04-01"),
       (null,"cart2","don","don","2015-02-01", "2015-04-01");
