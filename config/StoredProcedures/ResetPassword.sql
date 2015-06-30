DROP PROCEDURE IF EXISTS ResetPassword;

DELIMITER $$
CREATE PROCEDURE ResetPassword
(IN _Email varchar(255), _HP varchar(100), _US varchar(50))
BEGIN

UPDATE Users
SET HP=_HP, US=_US
WHERE Email=_Email;

END $$
DELIMITER ;