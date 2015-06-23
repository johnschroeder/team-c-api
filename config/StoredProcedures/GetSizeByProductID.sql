
use imp_db_dev;
DROP PROCEDURE IF EXISTS GetSizeByProductID;

DELIMITER $$
CREATE PROCEDURE GetSizeByProductID(IN _ProductID INT)
BEGIN

SELECT distinct(Name),Size from SizeMap
WHERE ProductID=_ProductID;

END $$

DELIMITER ;