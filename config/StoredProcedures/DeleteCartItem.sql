DROP PROCEDURE IF EXISTS DeleteCartItem;

DELIMITER $$
CREATE PROCEDURE DeleteCartItem
(IN _CartItemID int unsigned)
BEGIN

DECLARE cartItemSizeMapId int unsigned;
DECLARE cartItemQuantity int unsigned;
DECLARE cartItemRunId int unsigned;
DECLARE sizeMapSize int unsigned;
DECLARE runTransactionAmount int unsigned;
DECLARE runReserved int unsigned;

# get info needed to return inventory in run to available from reserved
SELECT SizeMapID, Quantity, RunID
FROM CartItems
WHERE CartItemID = _CartItemID
INTO @cartItemSizeMapId, @cartItemQuantity, @cartItemRunId;

# set local variables, clear persistent variables
SET cartItemSizeMapId = @cartItemSizeMapId;
SET @cartItemSizeMapId = null;
SET cartItemQuantity = @cartItemQuantity;
SET @cartItemQuantity = null;
SET cartItemRunId = @cartItemRunId;
SET @cartItemRunId = null;

# get size for sizeMapID
SELECT Size
FROM SizeMap
WHERE SizeMapID = cartItemSizeMapId
INTO sizeMapSize;

# determine how much inventory needs to be moved
SET runTransactionAmount = cartItemQuantity * sizeMapSize;

# get amount of reserved inventory in run to be altered
SELECT QuantityReserved
FROM Runs
WHERE RunID = cartItemRunId
INTO runReserved;

IF runTransactionAmount > runReserved THEN
    SELECT 'Not enough reserved inventory in run to complete request.' AS Result;
ELSE
	UPDATE Runs
    SET QuantityAvailable = QuantityAvailable + runTransactionAmount,
		QuantityReserved = QuantityReserved - runTransactionAmount
	WHERE RunID = cartItemRunId;

    DELETE FROM CartItems
    WHERE CartItemID = _CartItemID;

    SELECT 'Success' AS Result;
END IF;

END $$
DELIMITER ;