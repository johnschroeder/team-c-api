
# Result set columns
#CartItemID, ProductID, ProductName, PileID, Location, SizeMapID, SizeName, CountPerBatch, BatchCount, Total, id

use imp_db_dev;
DROP PROCEDURE IF EXISTS GetCartItems;

DELIMITER $$
CREATE PROCEDURE GetCartItems(IN _CartID int)
BEGIN

SELECT ci.CartItemID, sm.ProductID, p.Name as ProductName,
		pl.PileID, pl.Location, sm.SizeMapID, sm.Name as SizeName, sm.Size as CountPerBatch, ci.Quantity as BatchCount,
        sm.Size * ci.Quantity as Total
FROM CartItems ci
NATURAL JOIN Runs r
NATURAL JOIN Piles pl
NATURAL JOIN SizeMap sm
NATURAL JOIN RunMarkers rm
JOIN Products p on sm.ProductID = p.ProductID;

END $$

DELIMITER ;