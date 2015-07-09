DROP PROCEDURE IF EXISTS AddLogViewMapEntry;

DELIMITER $$
CREATE PROCEDURE AddLogViewMapEntry
(IN _Username varchar(25), IN _LogID int unsigned)
BEGIN

DECLARE message varchar(100);
DECLARE flag boolean;

SET message = 'Error:';
SET flag = false;

# check if username exists
IF NOT EXISTS (SELECT * FROM Users WHERE Username = _Username) THEN
	SET flag = true;
	SET message = CONCAT(message, ' Username: ', _Username, ' doesn\'t exist. ');
END IF;

# check if logId exists
IF NOT EXISTS (SELECT * FROM Logs WHERE LogID = _LogID) THEN
	SET flag = true;
	SET message = CONCAT(message, ' LogID: ', _LogID, ' doesn\'t exist.');
END IF;


IF flag = false THEN # no foreign key errors
	# check if entry already exists
	IF NOT EXISTS (SELECT * FROM LogViewMap WHERE LogID = _LogID AND Username = _Username) THEN
		# entry does not yet exist, add entry
		INSERT INTO LogViewMap
		VALUES (_Username, _LogID);
	END IF;
	# show entry
	SELECT *
	FROM LogViewMap
	WHERE Username = _Username AND LogID = _LogID;
ELSE # foreign key errors
	SELECT message;
END IF;

END $$
DELIMITER ;
