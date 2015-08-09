DROP PROCEDURE IF EXISTS GetRunsByProduct;

DELIMITER $$
CREATE PROCEDURE GetRunsByProduct
(IN _ProductID int unsigned)
BEGIN

SELECT R.RunID, IFNULL(R.AltID, 'n/a') AS AltID, Pi.Location, R.DateCreated, R.InitialQuantity, R.QuantityAvailable, R.QuantityReserved, IFNULL(RM.Marker, 'none') AS Marker
FROM Products Pr JOIN Piles Pi ON Pr.ProductID = Pi.ProductID JOIN Runs R ON Pi.PileID = R.PileID LEFT JOIN RunMarkers RM ON R.RunID = RM.RunID
WHERE Pr.ProductID = _ProductID
ORDER BY R.RunID DESC;

END $$
DELIMITER ;