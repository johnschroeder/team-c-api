
/*
#test script below
set @m='';
call DeleteItemInCart(1,@m);
select @m;
*/

use imp_db_dev;
DROP PROCEDURE IF EXISTS DeleteItemInCart;

DELIMITER $$
CREATE PROCEDURE DeleteItemInCart
(IN _CartItemID int, OUT _Msg varchar(512))
BEGIN

mylabel: BEGIN





DECLARE pdtID INT;
DECLARE sm INT;
DECLARE qty INT;
DECLARE rid INT;
DECLARE sz INT;


SELECT @sm:=ci.SizeMapID,@qty:=ci.Quantity, @rid:=ci.RunID
FROM CartItems ci
WHERE ci.CartItemID = _CartItemID;


SELECT @pdtID:=SizeMap.ProductID,@sz:=SizeMap.Size
FROM SizeMap
WHERE SizeMap.SizeMapID = @sm;




set @ttlCount=@sz*@qty;
select @rsv:=Runs.QuantityReserved from Runs where Runs.RunID = @rid;

IF @rsv >= @ttlCount THEN
	UPDATE Runs r
		SET r.QuantityAvailable=r.QuantityAvailable+@ttlCount,
		r.QuantityReserved= r.QuantityReserved-@ttlCount
		WHERE RunID=@rid;
	SET _Msg = 'Success';
ELSE
	SET _Msg = 'Not enough inventory to release in this run';
    SELECT _Msg;
    LEAVE mylabel;
END IF;

DELETE FROM CartItems where CartItems.CartItemID=_CartItemID;
SELECT _Msg;

END;
END $$

DELIMITER ;