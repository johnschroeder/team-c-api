DROP PROCEDURE IF EXISTS GetAllLogs;

DELIMITER $$
CREATE PROCEDURE GetAllLogs
(IN _username varchar(255), IN _LogID int unsigned)
BEGIN

INSERT INTO LogViewMap VALUES (_username, _LogID);


END $$
DELIMITER ;