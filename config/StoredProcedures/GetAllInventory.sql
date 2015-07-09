DROP PROCEDURE IF EXISTS GetAllInventory;

DELIMITER $$
CREATE PROCEDURE GetAllInventory()
BEGIN

select s1.*,s2.RunID as LastRunID,s2.InitialQuantity as LastRunInitialQuantity
from
(select p.ProductID, p.Name as ProductName,
sum(r.QuantityAvailable) as TotalQuantity,
max(r.DateCreated) as LastRunDate
from Products p
left join Piles pl on pl.ProductID = p.ProductID
left join Runs r on pl.PileID = r.PileID
where p.ViewOption != 0
group by p.ProductID) as s1

left join
(select r2.InitialQuantity, r2.DateCreated,r2.RunID, s3.ProductID
from
(select Max(r.RunID) as RunID, pl.ProductID
from Runs r
join Piles pl
on r.PileID = pl.PileID
group by pl.ProductID) as s3
join Runs r2 on r2.RunID = s3.RunID) as s2
on s1.ProductID = s2.ProductID;



END $$

DELIMITER ;