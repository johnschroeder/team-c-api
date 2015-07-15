
DROP PROCEDURE IF EXISTS GetSizeMapID;

DELIMITER $$
CREATE PROCEDURE GetSizeMapID(IN _ProductID INT, IN _SizeName INT, IN _Size INT)
BEGIN

SELECT max(SizeMapID) as SizeMapID, Name, Size from SizeMap
WHERE ProductID=_ProductID and name=_SizeName and Size=_Size;

END $$

DELIMITER ;