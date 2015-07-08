DROP PROCEDURE IF EXISTS AddLogViewMapEntry;

DELIMITER $$
CREATE PROCEDURE AddLogViewMapEntry
(IN _Username varchar(25), IN _LogID int unsigned)
BEGIN

DECLARE test int;
DECLARE message varchar(100);
DECLARE flag boolean;

SET message = 'Error:';
SET flag = false;

# check if username exists
SELECT EXISTS(
	SELECT 1
	FROM Users
	WHERE Username = _Username)
INTO test;

IF test = 0 THEN
	SET flag = true;
	SET message = CONCAT(message, ' Username: ', _Username, ' doesn\'t exist. ');
END IF;

SET test = 0;

# check if logId exists
SELECT EXISTS(
	SELECT 1
	FROM Logs
	WHERE LogID = _LogID)
INTO test;

IF test = 0 THEN
	SET flag = true;
	SET message = CONCAT(message, ' LogID: ', _LogID, ' doesn\'t exist.');
END IF;

SET test = 0;

IF flag = false THEN # no foreign key errors
	# check if entry already exists
	SELECT EXISTS(
		SELECT 1
		FROM LogViewMap
		WHERE Username = _Username AND LogID = _LogID)
	INTO test;

	IF test = 1 THEN
		# entry already exists, do nothing
	ELSE
		# entry does not yet exist, add entry
		INSERT INTO LogViewMap
		VALUES (_Username, _LogID);
	END IF;
	# show newly added or existing entry
	SELECT *
	FROM LogViewMap
	WHERE Username = _Username AND LogID = _LogID;
ELSE # foreign key errors
	SELECT message;
END IF;

END $$
DELIMITER ;