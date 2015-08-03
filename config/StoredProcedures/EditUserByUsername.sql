DROP PROCEDURE IF EXISTS EditUserByUsername;
DELIMITER $$
CREATE PROCEDURE (IN _username varchar(255), IN _firstname varchar(255), IN _lastname varchar(255), IN _permissions int)
  BEGIN
    UPDATE Users SET FirstName = _firstname, LastName = _lastname, PermsID = _permissions;
  END;

    END $$

DELIMITER ;