DROP PROCEDURE IF EXISTS AddLogViewMapEntry;

DELIMITER $$
CREATE PROCEDURE AddLogViewMapEntry
(IN _Username varchar(25), IN _LogID int unsigned)
BEGIN

DECLARE test int;

# check if entry already exists
SELECT EXISTS(
	SELECT 1
	FROM LogViewMap
	WHERE Username = _Username AND LogID = _LogID)
INTO @test;

IF @test = 1 THEN
	# entry already exists
  # show existing entry
	SELECT *
	FROM LogViewMap
	WHERE Username = _Username AND LogID = _LogID;
ELSE
	# entry does not yet exist
  # add entry
	INSERT INTO LogViewMap
	VALUES (_Username, _LogID);

  # show new entry
  SELECT *
	FROM LogViewMap
	WHERE Username = _Username AND LogID = _LogID;
END IF;

END $$
DELIMITER ;