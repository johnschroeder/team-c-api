DROP PROCEDURE IF EXISTS GetUserInfo;

DELIMITER $$
CREATE PROCEDURE GetUserInfo(IN _Username varchar(256))
BEGIN

SELECT FirstName, LastName, Email FROM Users WHERE username=_Username;

END $$
DELIMITER ;