DROP PROCEDURE IF EXISTS GetLogsByType;

DELIMITER $$
CREATE PROCEDURE GetLogsByType
(IN _LogType int unsigned)
BEGIN

SELECT *
FROM Logs
WHERE LogType = _LogType;

END $$
DELIMITER ;