DROP PROCEDURE IF EXISTS GetAllUsersFilterLastName;

DELIMITER $$
CREATE PROCEDURE GetAllUsersFilterLastName ()
BEGIN

SELECT Username, FirstName, LastName, Email, Perms
FROM Users JOIN Permissions ON Users.PermsID = Permissions.PermsID
ORDER BY LastName ASC;

END $$
DELIMITER ;