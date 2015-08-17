DROP PROCEDURE IF EXISTS EditUserByUsername;

DELIMITER $$
CREATE PROCEDURE EditUserByUsername
(IN _username varchar(255), IN _firstname varchar(255), IN _lastname varchar(255), IN _permissions int, IN _requestDeactivate int)
BEGIN

IF _requestDeactivate = 1 THEN
  UPDATE Users
  SET FirstName = _firstname, LastName = _lastname, PermsID = _permissions, isConfirmed = 0
  WHERE Username = _username;
ELSEIF _requestDeactivate = 0 THEN
  UPDATE Users
  SET FirstName = _firstname, LastName = _lastname, PermsID = _permissions
  WHERE Username = _username;
END IF;

END $$
DELIMITER ;