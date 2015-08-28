
DROP PROCEDURE IF EXISTS GetAllSizesByProductID;

DELIMITER $$
CREATE PROCEDURE GetAllSizesByProductID(IN _ProductID INT )
BEGIN

SELECT SizeMapID as sizeMapID, Name as name, Size as amountPerPackage
FROM SizeMap
WHERE ProductID=_ProductID;
END $$

DELIMITER ;