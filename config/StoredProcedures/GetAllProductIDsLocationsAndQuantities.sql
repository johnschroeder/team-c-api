DROP PROCEDURE IF EXISTS GetAllProductIDsLocationsAndQuantities

DELIMITER $$
CREATE PROCEDURE GetAllProductIDsLocationsAndQuantities ()
BEGIN
Select Pr.ProductID, Pi.Location, SUM(R.QuantityAvailable) AS TotalQuantityAvailable
      FROM Products Pr LEFT JOIN Piles Pi ON Pr.ProductID = Pi.ProductID LEFT JOIN Runs R ON Pi.PileID = R.PileID
      WHERE Pr.ViewOption = 1
     GROUP BY Pr.ProductID, Pi.Location
     ORDER BY Pr.ProductID ASC, Pi.Location ASC;

END $$
DELIMITER ;