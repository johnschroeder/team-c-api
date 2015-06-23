
use imp_db_dev;
DROP PROCEDURE IF EXISTS AddInventory;

DELIMITER $$
CREATE PROCEDURE AddInventory
(IN _ProductID int, IN _Quantity int,IN _Location varchar(50))
BEGIN
DECLARE plid INT;

insert into Piles values(null, _ProductID, _Location);

select @plid:=max(PileID) from Piles
where ProductID=_ProductID and Location=_Location;

insert into Runs values(null,@plid, CURDATE(),_Quantity,_Quantity,0);

END $$

DELIMITER ;