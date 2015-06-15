
use dev_ImpDB;
DROP PROCEDURE IF EXISTS AddItemToCart;

DELIMITER $$
CREATE PROCEDURE AddItemToCart
(IN CartID int, IN SizeMapID int, IN Quantity int, IN RunID int, OUT msg varchar(256))
BEGIN

DECLARE ProductID INT;
SELECT @ProductID:=sm.ProductID
FROM SizeMap sm
WHERE sm.RunID = RunID;

END $$

DELIMITER ;