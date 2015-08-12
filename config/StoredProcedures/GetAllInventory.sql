DROP PROCEDURE IF EXISTS GetAllInventory;

DELIMITER $$
CREATE PROCEDURE GetAllInventory()
BEGIN

SELECT S1.ProductID, S1.ProductName, IFNULL(SUM(S1.QuantityAvailable), 0) AS TotalQuantityAvailable, IFNULL(S1.DateCreated, 'n/a') AS LastRunDate, S1.RunID AS LastRunID, S1.InitialQuantity AS LastRunInitialQuantity
FROM
	  (Select Pr.ProductID, Pr.Name AS ProductName, R.RunID, R.DateCreated, R.InitialQuantity, R.QuantityAvailable
	  FROM Products Pr LEFT JOIN Piles Pi ON Pr.ProductID = Pi.ProductID LEFT JOIN Runs R ON Pi.PileID = R.PileID
	  WHERE Pr.ViewOption = 1
      ORDER BY Pr.ProductID ASC, R.DateCreated DESC, R.RunID DESC) AS S1
GROUP BY S1.ProductID
ORDER BY S1.ProductName ASC;

END $$
DELIMITER ;