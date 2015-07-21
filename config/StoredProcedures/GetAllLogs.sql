DROP PROCEDURE IF EXISTS GetAllLogs;

DELIMITER $$
CREATE PROCEDURE GetAllLogs
(IN _username varchar(255) IN _logID int unsigned)
BEGIN

insert INTO LogViewMap values (_username, _logID);

END $$
DELIMITER ;