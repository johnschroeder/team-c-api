
/*
#test script below
set @m='';
call DeleteCart(1,@m);
select @m;
*/

use imp_db_dev;
DROP PROCEDURE IF EXISTS DeleteCart;

DELIMITER $$
CREATE PROCEDURE DeleteCart
(IN _CartID int, OUT _Msg varchar(512))
BEGIN

mylabel: BEGIN

DECLARE n INT DEFAULT 0;
DECLARE tempCIid INT;



SELECT @n:=COUNT(*) FROM CartItems where CartID = _CartID;

SELECT @i:=0;

WHILE @i<@n DO
  SELECT @tempCIid:=CartItemID from CartItems order by CartItemID limit 1;
  SET @m='';
  CALL DeleteItemInCart(@tempCIid,@m);
  select @m;
    select 'Success';
  IF(@m ='Success') THEN
	SET _Msg = 'Success';
  ELSE
	SET _Msg = @m;
	LEAVE mylabel;
  END IF;
  SELECT @i := @i + 1;
  DELETE FROM CartItems WHERE CartItemID = @tempCIid;
END WHILE;

DELETE FROM Cart WHERE Cart.CartID=_CartID;
SET _Msg = 'Success';
END;
END $$

DELIMITER ;