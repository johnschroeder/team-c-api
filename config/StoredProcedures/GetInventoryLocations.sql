DROP PROCEDURE IF EXISTS GetInventoryLocations;

DELIMITER $$
CREATE PROCEDURE GetInventoryLocations
(_productID int)
BEGIN

SELECT DISTINCT(Piles.Location) FROM Piles
JOIN Products ON Piles.ProductID = Products.ProductID
WHERE Products.ProductID = _productID;

END $$
DELIMITER ;


