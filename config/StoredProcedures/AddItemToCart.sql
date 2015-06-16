
/*
To test this stored procedure, use below
#####success test####
set @m='';
call AddItemToCart(0,1,2,501,@m);
select @m;
#####not enough inventory test####
set @m='';
call AddItemToCart(0,1,200000,501,@m);
select @m;
*/

use dev_ImpDB;
DROP PROCEDURE IF EXISTS AddItemToCart;

DELIMITER $$
CREATE PROCEDURE AddItemToCart
(IN _CartID int, IN _SizeMapID int, IN _Quantity int, IN _RunID int, OUT _Msg varchar(512))
BEGIN

mylabel: BEGIN
DECLARE pdtID INT;
DECLARE sz INT;
SELECT @pdtID:=sm.ProductID,@sz:=sm.Size
FROM SizeMap sm
WHERE sm.SizeMapID = _SizeMapID;

set @ttlCount=@sz*_Quantity;
select @avlb:=Runs.QuantityAvailable from Runs where Runs.RunID = _RunID;

IF @avlb>=@ttlCount THEN
	UPDATE Runs r
		SET r.QuantityAvailable=r.QuantityAvailable-@ttlCount,
		r.QuantityReserved= r.QuantityReserved+@ttlCount
		WHERE RunID=_RunID;
	SET _Msg = 'Success';
ELSE
	SET _Msg = 'Not enough inventory in the run';
    SELECT _Msg;
    LEAVE mylabel;
END IF;

INSERT INTO CartItems values(null,_CartID,_SizeMapID,_Quantity,_RunID);
SELECT _Msg;

END;
END $$

DELIMITER ;