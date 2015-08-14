
# Result set columns
#cartItemID, productID, productName, pileID, location, sizeMapID, sizeName, amountPerPackage, packageCount, runID, color

DROP PROCEDURE IF EXISTS GetCartItemsByCartID;

DELIMITER $$
CREATE PROCEDURE GetCartItemsByCartID(IN _CartID int)
BEGIN

SELECT
			ci.CartItemID AS cartItemID,
			ci.CartID AS cartID,
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
JOIN Cart c on ci.CartID = c.CartID
JOIN Runs r on ci.RunID = r.RunID
LEFT JOIN RunMarkers rm on r.RunID = rm.RunID
JOIN Piles pl on pl.PileID = r.PileID
JOIN SizeMap sm on sm.SizeMapID = ci.SizeMapID
JOIN Products p ON pl.ProductID = p.ProductID
WHERE ci.CartID = _CartID;

END $$

DELIMITER ;