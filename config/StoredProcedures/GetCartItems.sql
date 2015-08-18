DROP PROCEDURE IF EXISTS GetCartItems;

DELIMITER $$
CREATE PROCEDURE GetCartItems(IN _CartID int unsigned)
BEGIN

SELECT CI.CartItemID, Pr.ProductID, Pr.Name AS ProductName, Pr.Description AS ProductDescription, Pi.PileID, Pi.Location, CI.RunID, IFNULL(R.AltID, 'n/a') AS AltID,
	   IFNULL(RM.Marker, 'n/a') AS Color, CI.SizeMapID, SM.Name AS PackageName, SM.Size AS PackageSize, CI.Quantity AS PackageCount, CI.Quantity * SM.Size AS TotalAmount
FROM CartItems CI JOIN Runs R ON CI.RunID = R.RunID LEFT JOIN RunMarkers RM ON R.RunID = RM.RunID
				  JOIN Piles Pi ON Pi.PileID = R.PileID JOIN Products Pr ON Pi.ProductID = Pr.ProductID
				  JOIN SizeMap SM ON CI.SizeMapID = SM.SizeMapID
WHERE CI.CartID = _CartID;

END $$
DELIMITER ;