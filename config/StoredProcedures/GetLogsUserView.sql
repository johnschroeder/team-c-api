DROP PROCEDURE IF EXISTS GetLogsUserView;

DELIMITER $$
CREATE PROCEDURE GetLogsUserView
(IN _Username varchar(25))
BEGIN

SELECT *
FROM Logs
WHERE LogID NOT IN (
	SELECT LogID
	FROM LogViewMap
	WHERE Username = _Username
);

END $$
DELIMITER ;