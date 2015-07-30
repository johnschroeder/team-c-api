DROP PROCEDURE IF EXISTS imp_db_dev.GetInventoryLocations;

DELIMITER $$

CREATE PROCEDURE GetInventoryLocations(_productID)

BEGIN

SELECT DISTINCT(Piles.Location) FROM Piles
JOIN Products ON Piles.ProductID = Products.ProductID
WHERE Products.ProductID = _productID;

END $$
DELIMITER ;