DROP PROCEDURE IF EXISTS LogAction;

DELIMITER $$
CREATE PROCEDURE LogAction
(IN _LogType int unsigned, IN _Username varchar(25), IN _ActionData varchar(2048))
BEGIN

INSERT INTO Logs
VALUES (NULL, _LogType, _Username, default, _ActionData);

SELECT *
FROM Logs
WHERE LogID = last_insert_id();

END $$
DELIMITER ;