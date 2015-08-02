DROP PROCEDURE IF EXISTS EditUserByUsername;

DELIMITER $$

BEGIN

CREATE PROCEDURE EditUserByUsername
(IN _username varchar(255), IN _firstname varchar(255), IN _lastname varchar(255), IN _permissions int, IN _requestDelete)


IF (_requestDelete == 1)

UPDATE Users
SET FirstName = _firstname, LastName = _lastname, PermsID = _permissions, isConfirmed = 0
WHERE Username = _username;

ELSE IF (_requestDelete == 0)

UPDATE Users
SET FirstName = _firstname, LastName = _lastname, PermsID = _permissions
WHERE Username = _username;


END $$

DELIMITER ;