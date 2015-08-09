DROP PROCEDURE IF EXISTS ReserveCartItemBySingles;

DELIMITER $$
CREATE PROCEDURE ReserveCartItemBySingles
(IN _CartID int unsigned, IN _ProductID int unsigned, IN _Location varchar(50), IN _ToReserve int unsigned)
BEGIN

DECLARE remainingQuantityToReserve int unsigned;
DECLARE currentRunID int unsigned;
DECLARE currentRunQuantityAvailable int unsigned;
DECLARE currentRunQuantityReserve int unsigned;
DECLARE productSizeMapID int unsigned;
DECLARE flag boolean;

SET RemainingQuantityToReserve = _ToReserve;
SET flag = true;

# get sizemap ID for this product's singles mapping
Select SizeMapID
FROM SizeMap
WHERE ProductID = _ProductID AND Size = 1
INTO productSizeMapID;

# iterate through all runs (oldest first) at location for the product
WHILE RemainingQuantityToReserve > 0 AND Flag DO
    SELECT R.RunID, R.QuantityAvailable
    FROM Products Pr JOIN Piles Pi ON Pr.ProductID = Pi.ProductID JOIN Runs R ON Pi.PileID = R.PileID
    WHERE Pr.ProductID = _ProductID AND Pi.Location = _Location AND R.QuantityAvailable > 0
    ORDER BY R.DateCreated ASC
    LIMIT 1
    INTO @currentRunID, @currentRunQuantityAvailable;

    SET currentRunID = @currentRunID;
    SET currentRunQuantityAvailable = @currentRunQuantityAvailable;
    SET @currentRunID = NULL;
    SET @currentRunQuantityAvailable = NULL;
    SET currentRunQuantityReserve = 0;

    # determine quantity to remove
    IF currentRunQuantityAvailable > 0 AND remainingQuantityToReserve > 0 AND currentRunID IS NOT NULL THEN
		IF currentRunQuantityAvailable > remainingQuantityToReserve THEN
			SET currentRunQuantityAvailable = currentRunQuantityAvailable - remainingQuantityToReserve;
            SET currentRunQuantityReserve = remainingQuantityToReserve;
            SET remainingQuantityToReserve = 0;
		ELSE
			SET remainingQuantityToReserve = remainingQuantityToReserve - currentRunQuantityAvailable;
            SET currentRunQuantityReserve = currentRunQuantityAvailable;
            SET currentRunQuantityAvailable = 0;
		END IF;
    END IF;

    IF currentRunID IS NULL THEN
		SET flag = false;
	END IF;

	IF currentRunQuantityReserve > 0 THEN
		# create cartItem
		INSERT INTO CartItems VALUES
		(NULL, _CartID, productSizeMapID, currentRunQuantityReserve, currentRunID);

		# update run quantities
		UPDATE Runs
		SET QuantityAvailable = (QuantityAvailable - currentRunQuantityReserve),
			QuantityReserved  = (QuantityAvailable + currentRunQuantityReserve)
		WHERE RunID = currentRunID;
	END IF;
END WHILE;

# return _toReserve
SELECT remainingQuantityToReserve;

END $$
DELIMITER ;