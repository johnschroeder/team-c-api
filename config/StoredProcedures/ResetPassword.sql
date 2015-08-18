DROP PROCEDURE IF EXISTS ResetPassword;

DELIMITER $$
CREATE Procedure ResetPassword
(IN _Username varchar(25), IN _HP varchar(100), IN _US varchar(50))
BEGIN

IF EXISTS (SELECT * FROM Users WHERE Username = _Username) THEN
    UPDATE Users
    SET HP = _HP, US = _US
    WHERE Username = _Username;
    
    SELECT "Success";
ELSE
    SELECT CONCAT("The username ", _Username, " does not exist.");
END IF;

END $$;
DELIMITER ;
