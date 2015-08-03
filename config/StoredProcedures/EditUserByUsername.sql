DROP PROCEDURE IF EXISTS EditUserByUsername;

DELIMITER $$

CREATE PROCEDURE EditUserByUsername
  (IN _username varchar(255), IN _firstname varchar(255), IN _lastname varchar(255), IN _permissions int, IN _activated INT)

  BEGIN

    CASE _activated
      WHEN 0 THEN
      UPDATE Users SET FirstName = _firstname, LastName = _lastname, PermsID = _permissions, isConfirmed = FALSE 
      WHERE Username = _username;
      WHEN 1 THEN
      UPDATE Users SET FirstName = _firstname, LastName = _lastname, PermsID = _permissions, isConfirmed = isConfirmed IN (SELECT * FROM (SELECT isConfirmed FROM Users WHERE Username = _username)tt)
      WHERE Username = _username;
    ELSE BEGIN SELECT * FROM Users; END;
    END CASE;

  END $$

DELIMITER ;