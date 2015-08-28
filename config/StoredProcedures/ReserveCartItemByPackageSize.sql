DROP PROCEDURE IF EXISTS ReserveCartItemByPackageSize;

DELIMITER $$
CREATE PROCEDURE ReserveCartItemByPackageSize
(IN _CartID int unsigned, IN _ProductID int unsigned, IN _Location varchar(50), IN _PackageCount int unsigned, IN _PackageSize int unsigned, IN _SizeMapID int unsigned, IN _ToReserve int unsigned)
BEGIN

DECLARE remainingQuantityToReserve int unsigned;
DECLARE currentRunID int unsigned;
DECLARE currentRunQuantityAvailable int unsigned;
DECLARE currentRunPackagesReserve int unsigned;
DECLARE flag BOOLEAN;  # indicates whether we should continue into the next run by package size
DECLARE totalPackagesReserve int unsigned;

SET RemainingQuantityToReserve = _ToReserve;  # should be _PackageSize * _PackageCount
SET flag = true;
SET totalPackagesReserve = 0;

# iterate through all runs (oldest first) at location for the product
WHILE RemainingQuantityToReserve > 0 AND flag DO
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

    # when it encounters a run with available quantity reserve up to _toReserve using the size,
    # and count the number of packages of that size were deducted

    SET currentRunPackagesReserve = 0;

    # determine how many packages to remove
    WHILE currentRunQuantityAvailable >= _PackageSize AND remainingQuantityToReserve > 0 AND totalPackagesReserve < _PackageCount AND currentRunID IS NOT NULL DO
        SET currentRunPackagesReserve = currentRunPackagesReserve + 1;
        SET totalPackagesReserve = totalPackagesReserve + 1;
        SET remainingQuantityToReserve = remainingQuantityToReserve - _PackageSize;
        SET currentRunQuantityAvailable = currentRunQuantityAvailable - _PackageSize;
    END WHILE;

    # if there is still inventory in the current run but not enough for another
    # package of the size required then need to end loop (switch to singles)
    IF currentRunQuantityAvailable > 0 THEN
        SET flag = false;
    END IF;

    # if we were able to fully fulfill the request we need to end the loop
    IF _PackageCount <= currentRunPackagesReserve THEN # _PackageCount should never actually be less than currentRunPackagesReserve
        SET flag = false;
    END IF;

    IF currentRunID IS NULL THEN
		SET flag = false;
	END IF;

	IF currentRunPackagesReserve > 0 THEN
		# create cartItem
		INSERT INTO CartItems VALUES
		(NULL, _CartID, _SizeMapID, currentRunPackagesReserve, currentRunID);

		# update run quantities
		UPDATE Runs
		SET QuantityAvailable = (QuantityAvailable - (currentRunPackagesReserve * _PackageSize)),
			QuantityReserved  = (QuantityReserved + (currentRunPackagesReserve * _PackageSize))
		WHERE RunID = currentRunID;
	END IF;

END WHILE;

# return _toReserve
SELECT remainingQuantityToReserve;

END $$
DELIMITER ;
