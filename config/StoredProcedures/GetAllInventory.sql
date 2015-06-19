use imp_db_dev;
DROP PROCEDURE IF EXISTS GetAllInventory;
#columns returned are ProductID, ProductName, TotalQuantity, LastRunDate, LastRunID, LastRunInitialQuantity
DELIMITER $$
CREATE PROCEDURE GetAllInventory()
BEGIN


select s2.*, s1.RunID as LastRunID, s1.InitialQuantity as LastRunInitialQuantity
from Runs s1
join
(select p.ProductID, p.Name as ProductName,
sum(r.QuantityAvailable) as TotalQuantity,
max(r.DateCreated) as LastRunDate
from Runs r
join Piles pl on pl.PileID = r.PileID
join Products p on pl.ProductID = p.ProductID
group by p.ProductID) as s2
on s1.DateCreated = s2.LastRunDate
order by ProductID;


END $$

DELIMITER ;