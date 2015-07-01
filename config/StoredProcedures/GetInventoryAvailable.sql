DROP PROCEDURE IF EXISTS GetInventoryAvailable;

DELIMITER $$
CREATE PROCEDURE GetInventoryAvailable
(IN _ProductID int unsigned, IN _PileLocation varchar(50), IN _RunMarker varchar(30))
BEGIN

SELECT SUM(R.QuantityAvailable) AS TotalQuantityAvailable
FROM Products Pr JOIN Piles Pi ON Pr.ProductID = Pi.ProductID JOIN Runs R ON Pi.PileID = R.PileID JOIN RunMarkers RM ON R.RunID = RM.RunID
WHERE Pr.ProductID = _ProductID  AND Pi.Location = _PileLocation And RM.Marker = _RunMarker;

END $$
DELIMITER ;