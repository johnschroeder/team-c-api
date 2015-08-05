DROP PROCEDURE IF EXISTS GetAllUsersFilterFirstName;

DELIMITER $$
CREATE PROCEDURE GetAllUsersFilterFirstName ()
BEGIN

SELECT Username, FirstName, LastName, Email, Perms
FROM Users JOIN Permissions ON Users.PermsID = Permissions.PermsID
ORDER BY FirstName ASC;

END $$
DELIMITER ;