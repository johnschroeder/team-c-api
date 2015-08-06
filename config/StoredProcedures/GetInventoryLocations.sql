DROP PROCEDURE IF EXISTS GetInventoryLocations;

DELIMITER $$

CREATE PROCEDURE GetInventoryLocations(IN _productID INT)

BEGIN

SELECT DISTINCT(Piles.Location) FROM Piles
JOIN Products ON Piles.ProductID = Products.ProductID
WHERE Products.ProductID = _productID;

END $$
DELIMITER ;