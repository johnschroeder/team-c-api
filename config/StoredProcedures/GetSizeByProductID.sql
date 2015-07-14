
DROP PROCEDURE IF EXISTS GetSizeByProductID;

DELIMITER $$
CREATE PROCEDURE GetSizeByProductID(IN _ProductID INT)
BEGIN

SELECT distinct(Size), SizeMapID, Name from SizeMap
WHERE ProductID=_ProductID;

END $$

DELIMITER ;