DROP PROCEDURE IF EXISTS GetRunsByProduct;

DELIMITER $$
CREATE PROCEDURE GetRunsByProduct
(IN _ProductID int unsigned)
BEGIN

SELECT R.RunID, R.AltID, Pi.Location, R.DateCreated, R.InitialQuantity, R.QuantityAvailable, R.QuantityReserved
FROM Products Pr JOIN Piles Pi ON Pr.ProductID = Pi.ProductID JOIN Runs R ON Pi.PileID = R.PileID
WHERE Pr.ProductID = _ProductID;

END $$
DELIMITER ;