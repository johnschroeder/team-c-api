# This procedure locates the cart item matching the _CartItemID input and sets the row values as specified by the remaining
# input arguments. Before attemping to update the row it will check to make sure that the input is valid - doesn't violate
# foreign key constraints.

DROP PROCEDURE IF EXISTS EditCartItem;

DELIMITER $$
CREATE PROCEDURE EditCartItem
(IN _CartItemID int unsigned, IN _CartID int unsigned, IN _SizeMapID int unsigned, IN _Quantity int unsigned, IN _RunID int unsigned)
BEGIN

DECLARE testCartItemID int;
DECLARE testCartID int;
DECLARE testSizeMapID int;
DECLARE testRunID int;
DECLARE flag boolean;
DECLARE message varchar(1024);

SET @testCartItemID = 0;
SET @testCartID = 0;
SET @testSizeMapID = 0;
SET @testRunID = 0;
SET @flag = 1;
SET @message = 'ERROR(S):';

# verify CartItemID
SELECT EXISTS(
SELECT 1
FROM CartItems
WHERE CartItemID = _CartItemID)
INTO @testCartItemID;

IF @testCartItemID = 0 THEN
	SET @message = CONCAT(@message, ' Invalid CartItemID input.');
    SET @flag = 0;
END IF;

# verify CartID
SELECT EXISTS(
SELECT CartID
FROM Cart
WHERE CartID = _CartID)
INTO @testCartID;

IF @testCartID = 0 THEN
	SET @message = CONCAT(@message, ' Invalid CartID input.');
    SET @flag = 0;
END IF;

# verify SizeMapID
SELECT EXISTS(
SELECT SizeMapID
FROM SizeMap
WHERE SizeMapID = _SizeMapID)
INTO @testSizeMapID;

IF @testSizeMapID = 0 THEN
	SET @message = CONCAT(@message, ' Invalid SizeMapID input.');
    SET @flag = 0;
END IF;

# verify RunID
SELECT EXISTS(
SELECT RunID
FROM Runs
WHERE RunID = _RunID)
INTO @testRunID;

IF @testRunID = 0 THEN
	SET @message = CONCAT(@message, ' Invalid RunID input.');
    SET @flag = 0;
END IF;

IF @flag = 1 THEN
	UPDATE CartItems
	SET CartID=_CartID, SizeMapID=_SizeMapID, Quantity=_Quantity, RunID=_RunID
	WHERE CartItemID = _CartItemID;

    SET @message = 'Success';
END IF;

SELECT @message;

END $$
DELIMITER ;