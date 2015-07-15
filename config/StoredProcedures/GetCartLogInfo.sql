DROP PROCEDURE IF EXISTS GetCartLogInfo;

DELIMITER $$
CREATE PROCEDURE GetCartLogInfo
(_CartID int unsigned, IN _SizeMapID int unsigned, IN _Quantity int unsigned)
BEGIN

SELECT CartName, ProductID, (Size * _Quantity) AS Amount
FROM Cart, SizeMap
WHERE CartID = _CartID AND SizeMapID = _SizeMapID;

END $$
DELIMITER ;
