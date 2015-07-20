
# Result set columns
#cartItemID, productID, productName, pileID, location, sizeMapID, sizeName, amountPerPackage, packageCount, runID, color

DROP PROCEDURE IF EXISTS GetCartItemsByCartID;

DELIMITER $$
CREATE PROCEDURE GetCartItemsByCartID(IN _CartID int)
BEGIN

SELECT  ci.CartItemID AS cartItemID,
        sm.ProductID AS productID,
        p.Name AS productName,
		    pl.PileID AS pileID,
		    pl.Location AS location,
		    sm.SizeMapID AS sizeMapID,
		    sm.Name AS sizeName,
		    sm.Size AS amountPerPackage,
		    ci.Quantity AS packageCount,
        r.QuantityAvailable as availableQuantityInRun,
        r.RunID AS runID,
        rm.Marker AS color
FROM CartItems ci
NATURAL JOIN Runs r
NATURAL JOIN RunMarkers rm
NATURAL JOIN Piles pl
NATURAL JOIN SizeMap sm
JOIN Products p ON sm.ProductID = p.ProductID;

END $$

DELIMITER ;