DROP TRIGGER IF EXISTS unique_username_usergroup;

DELIMITER $$
CREATE TRIGGER unique_username_usergroup BEFORE INSERT ON Users
FOR EACH ROW
BEGIN

IF EXISTS(
	SELECT *
	FROM UserGroups
	WHERE GroupName = new.Username) THEN
    SIGNAL SQLSTATE '46000' SET MESSAGE_TEXT = 'You can\'t create a new user with a username matching an already existing user group.';
END IF;

# If an attempt is made to add a new user that has the same Users.Username
# as an already existing UserGroups.GroupName this will cause an error

END $$
DELIMITER ;