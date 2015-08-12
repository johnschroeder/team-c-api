DROP TRIGGER IF EXISTS unique_usergroup_username;

DELIMITER $$
CREATE TRIGGER unique_usergroup_username BEFORE INSERT ON UserGroups
FOR EACH ROW
BEGIN

IF EXISTS(
	SELECT *
	FROM Users
	WHERE Username = new.GroupName) THEN
    SIGNAL SQLSTATE '47000' SET MESSAGE_TEXT = 'You can\'t create a new user group with a group name matching an already existing user.';
END IF;

# If an attempt is made to add a new user group that has the same UserGroups.GroupName
# as an already existing Users.Username this will cause an error

END $$
DELIMITER ;
