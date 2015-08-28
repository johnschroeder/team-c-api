DROP TRIGGER IF EXISTS add_run_color;

DELIMITER $$
CREATE TRIGGER add_run_color AFTER INSERT ON Runs
FOR EACH ROW
BEGIN

DECLARE currentColor varchar(20);
DECLARE continueFlag boolean;
DECLARE colorCount int;
DECLARE productId int unsigned;

SET continueFlag = true;
SET colorCount = 1;

# get product ID for new run
SELECT Pr.ProductID
FROM Products Pr JOIN Piles Pi ON Pr.ProductID = Pi.ProductID JOIN Runs R ON Pi.PileID = R.PileID
WHERE R.RunID = NEW.RunID
INTO productId;

# iterate through possible colors
WHILE continueFlag AND colorCount <= 8 DO
	# determine which color to try next
    IF colorCount = 1 THEN
		SET currentColor = 'Blue';
	ELSEIF colorCount = 2 THEN
		SET currentColor = 'Red';
	ELSEIF colorCount = 3 THEN
		SET currentColor = 'Green';
	ELSEIF colorCount = 4 THEN
		SET currentColor = 'Yellow';
	ELSEIF colorCount = 5 THEN
		SET currentColor = 'Purple';
	ELSEIF colorCount = 6 THEN
		SET currentColor = 'Orange';
	ELSEIF colorCount = 7 THEN
		SET currentColor = 'Cyan';
	ELSEIF colorCount = 8 THEN
		SET currentColor = 'Pink';
	END IF;

	IF NOT EXISTS (
		Select RM.Marker AS Color
		FROM Products Pr LEFT JOIN Piles Pi ON Pr.ProductID = Pi.ProductID LEFT JOIN Runs R ON Pi.PileID = R.PileID LEFT JOIN RunMarkers RM ON R.RunID = RM.RunID
		WHERE Pr.ProductID = productId AND Pr.ViewOption = 1 AND (R.QuantityAvailable > 0 OR R.QuantityReserved > 0) AND RM.Marker = currentColor
		ORDER BY Pr.ProductID ASC, R.DateCreated DESC, R.RunID DESC) THEN

		# use the current color for new run
        SET continueFlag = false;
	ELSE
		# go to next color
        SET colorCount = colorCount + 1;
	END IF;
END WHILE;

IF colorCount > 8 THEN
	# at least 8 runs for that product exist, every color is taken
    # find color of last entered run
    SELECT RM.Marker
    FROM Runs R JOIN RunMarkers RM ON R.RunID = RM.RunID
    WHERE R.RunID = (SELECT MAX(RunID) From Runs WHERE RunID != NEW.RunID)
    INTO currentColor;

    # use next color in cycle
	IF currentColor = 'Blue' THEN
		SET currentColor = 'Red';
	ELSEIF currentColor = 'Red' THEN
		SET currentColor = 'Green';
	ELSEIF currentColor = 'Green' THEN
		SET currentColor = 'Yellow';
	ELSEIF currentColor = 'Yellow' THEN
		SET currentColor = 'Purple';
	ELSEIF currentColor = 'Purple' THEN
		SET currentColor = 'Orange';
	ELSEIF currentColor = 'Orange' THEN
		SET currentColor = 'Cyan';
	ELSEIF currentColor = 'Cyan' THEN
		SET currentColor = 'Pink';
	ELSEIF currentColor = 'Pink' THEN
		SET currentColor = 'Blue';
	END IF;
END IF;

# add color marker for newly entered run
INSERT INTO RunMarkers VALUES
((SELECT MAX(RunID) FROM Runs), currentColor);

# MAX(RunID) might not be quite as safe as using last_insert_id(), but
# that doesn't work due to the insert of the run being outside the
# scope of the trigger

END $$
DELIMITER ;