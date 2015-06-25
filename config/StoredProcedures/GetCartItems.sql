
# Result set columns
#CartItemID, ProductID, ProductName, PileID, Location, SizeMapID, SizeName, CountPerBatch, BatchCount, Total, RunID, RunMarker

use imp_db_dev;
DROP PROCEDURE IF EXISTS GetCartItems;

DELIMITER $$
CREATE PROCEDURE GetCartItems(IN _CartID int)
BEGIN

SELECT ci.CartItemID, sm.ProductID, p.Name as ProductName, 
		pl.PileID, pl.Location, sm.SizeMapID, sm.Name as SizeName, sm.Size as CountPerBatch, ci.Quantity as BatchCount,
        sm.Size * ci.Quantity as Total, r.RunID, rm.Marker
FROM CartItems ci
NATURAL JOIN Runs r
Natural join RunMarkers rm 
NATURAL JOIN Piles pl
NATURAL JOIN SizeMap sm
JOIN Products p on sm.ProductID = p.ProductID;

END $$

DELIMITER ;