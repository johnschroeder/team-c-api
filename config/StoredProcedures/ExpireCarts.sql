

DROP PROCEDURE IF EXISTS ExpireCarts;

DELIMITER $$
CREATE PROCEDURE ExpireCarts()
BEGIN

DECLARE n INT DEFAULT 0;
DECLARE tempCIid int unsigned;

SELECT @n:=COUNT(*) FROM Cart where DateToDelete <= NOW();

SELECT @i:=0;

WHILE @i<@n DO
  SELECT @tempCid:=CartID from Cart where DateToDelete <= NOW() order by CartID limit 1;
  set @m='';
  CALL DeleteCart(@tempCid,@m);
  SET @i := @i + 1;
END WHILE;

Select @i;

END $$

DELIMITER ;