# This procedure is used to reserve inventory and add that inventory to the cart specified.
# It will determine which runs should be removed from automatically and will return a success message and
# stringified object containing which runs were removed from, the quantities removed from those runs, and the location
# of those runs.

# Usage:
#    CALL AddItemToCartGeneral(CartID, SizeMapID, NumPackagesToRemove, Message, RunInfo)     where Message and RunInfo are empty strings
# Example:
#    SET @m='';
#    SET @r='';
#    CALL AddItemToCartGeneral(2, 2, 1200, @m, @r);
#    SELECT @m, @r;

DROP TABLE IF EXISTS AddItemToCartGeneralDebug;
CREATE TABLE AddItemToCartGeneralDebug(
DebugID int,
Message varchar(255)
);

USE imp_db_dev;
DROP PROCEDURE IF EXISTS AddItemToCartGeneral;

DELIMITER $$
CREATE PROCEDURE AddItemToCartGeneral
(IN _CartID int unsigned, IN _SizeMapID int unsigned, IN _PackagesRequested int unsigned, OUT _Msg varchar(500), OUT _RunInfo varchar(1024))
BEGIN

DECLARE pID int unsigned; # ProductID
DECLARE packageSize int unsigned; # size of package/batch/bundle/collection to be pulled
DECLARE totalQuantityAvailable int unsigned; # total amount of packages of given size available for that product
DECLARE rawTotalAvailable int unsigned; # total amount of inventory available for that product
DECLARE quantityRemaining int unsigned; # total amount of packages of given size still needed
DECLARE currentRunId int unsigned; # run currently being modified
DECLARE currentRunLocation varchar(50); # location of current run being modified
DECLARE currentRunAvailable int unsigned; # amount of packages of given size available in run currently being modified
DECLARE currentRunRemove int unsigned; # the amount of packages of given size to remove from the current run
DECLARE empty int; # zero, used for WHILE condition

SET @empty = 0;

# get ProductID
SELECT @pID := ProductID, @packageSize := Size
FROM SizeMap
WHERE SizeMapID = _SizeMapID;

# get total amount of inventory available for that product
SELECT @totalQuantityAvailable := SUM(FLOOR(Runs.QuantityAvailable / @packageSize)), @rawTotalAvailable := SUM(Runs.QuantityAvailable)
FROM Piles JOIN Products ON Piles.ProductID = Products.ProductID JOIN Runs ON Runs.PileID = Piles.PileID
WHERE Products.ProductID = @pID;

IF @totalQuantityAvailable < _PackagesRequested THEN
    # can't continue because not enough inventory available
    SET _Msg = CONCAT('Error: Not enough inventory available: TotalQuantityAvailable = ', @rawTotalAvailable, ' --> Requested ', _PackagesRequested, ' packages of size ', @packageSize, ', but only have ', @totalQuantityAvailable, ' packages of size ', @packageSize, ' available.');
    SET _RunInfo = '[]';
    IF @rawTotalAvailable > (_PackagesRequested * @packageSize) THEN
		SET _Msg = CONCAT(_MSG, ' Note: Enough physical inventory exists if smaller packages are combined.');
	END IF;
ELSE
    # enough inventory available to complete request
    SET @quantityRemaining = _PackagesRequested;
    SET _RunInfo = '[';
    WHILE @quantityRemaining > @empty DO
        # get next run to remove from
        SELECT @currentRunId := RunID
        FROM Runs JOIN Piles ON Runs.PileID = Piles.PileID JOIN Products ON Products.ProductID = Piles.ProductID
        WHERE FLOOR(Runs.QuantityAvailable / @packageSize) > 0 AND Products.ProductID = @pID
        ORDER BY Runs.DateCreated DESC
        LIMIT 1;

        # get quantity available in next run to remove from
        SELECT @currentRunAvailable := FLOOR(QuantityAvailable / @packageSize)
        FROM Runs
        WHERE RunID = @currentRunId;

        # get location for next run to remove from
        SELECT @currentRunLocation := Location
        FROM Runs Natural JOIN Piles
        WHERE RunID = @currentRunId;

        # set how much should be removed from current run
        IF @quantityRemaining > @currentRunAvailable THEN
            SET @currentRunRemove = @currentRunAvailable;
        ELSE
            SET @currentRunRemove = @quantityRemaining;
        END IF;

        IF @currentRunRemove != @empty THEN
			# update run table
			UPDATE Runs
				SET Runs.QuantityAvailable = (Runs.QuantityAvailable - (@currentRunRemove * @packageSize)),
					Runs.QuantityReserved = (Runs.QuantityReserved + (@currentRunRemove * @packageSize))
				WHERE Runs.RunID = @currentRunId;

			# add new cart entry
			INSERT INTO CartItems values(null, _CartID, _SizeMapID, @currentRunRemove, @currentRunId);

			# update quantity remaining
			SET @quantityRemaining = @QuantityRemaining - @currentRunRemove;

			# append result message
			SET _RunInfo = CONCAT(_RunInfo, '{"RunID": ', @currentRunID, ', "PackagesRemoved": ', @currentRunRemove, ', "PackageSize": ', @packageSize,', "Location": ', @currentRunLocation, '}');
			IF @QuantityRemaining > 0 THEN
				# need to append comma
				SET _RunInfo = CONCAT(_RunInfo, ', ');
			END IF;
        ELSE
			INSERT INTO AddItemToCartGeneralDebug
            VALUES (@indexCount + 11, 'Don\'t remove any from this run. Go to next run.');
		END IF;
    END WHILE;
    SET _RunInfo = CONCAT(_RunInfo, ']');
    SET _MSG = 'Success';
END IF;
SELECT _Msg, _RunInfo;

END $$
DELIMITER ;