DROP PROCEDURE IF EXISTS GetRunsByProduct;

DELIMITER $$
CREATE PROCEDURE GetRunsByProduct
(IN _ProductID int unsigned)
BEGIN

SELECT R.RunID, Pi.Location, R.DateCreated, R.InitialQuantity, R.QuantityAvailable, R.QuantityReserved
FROM Products Pr LEFT JOIN Piles Pi ON Pr.ProductID = Pi.ProductID LEFT JOIN Runs R ON Pi.PileID = R.PileID
WHERE Pr.ProductID = _ProductID;

END $$
DELIMITER ;