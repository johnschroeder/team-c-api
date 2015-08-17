DROP PROCEDURE IF EXISTS DeactivateUser;
DELIMITER $$
CREATE PROCEDURE DeactivateUser(IN _username varchar(255))
  BEGIN
    UPDATE Users SET isConfirmed = false WHERE Username = _username;

  END $$
DELIMITER ;