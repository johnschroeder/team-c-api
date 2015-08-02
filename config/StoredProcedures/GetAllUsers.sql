DROP PROCEDURE IF EXISTS GetAllUsers;

DELIMITER $$
CREATE PROCEDURE GetAllUsers ()
BEGIN

SELECT Username, FirstName, LastName, Email, Perms
FROM Users JOIN Permissions ON Users.PermsID = Permissions.PermsID WHERE Users.Username NOT IN ("System shows");
ORDER BY Username ASC;

END $$
DELIMITER ;