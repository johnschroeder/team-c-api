use imp_db_dev;
DROP PROCEDURE IF EXISTS GetInventoryByProductID;

DELIMITER $$
CREATE PROCEDURE GetInventoryByProductID(IN _ProductID int)
BEGIN
select  pl.PileID, pl.ProductID, sm.SizeMapID, sm.Name as SizeName, sm.Size, r.QuantityAvailable, pl.Location
from Runs r
left join Piles pl on r.PileID = pl.PileID
left join SizeMap sm on sm.ProductID = pl.ProductID
where pl.ProductID=_ProductID;

END $$
DELIMITER ;


