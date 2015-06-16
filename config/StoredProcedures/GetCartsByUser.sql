
use dev_ImpDB;
DROP PROCEDURE IF EXISTS GetCartsByUser;

DELIMITER $$
CREATE PROCEDURE GetCartsByUser(IN _Username varchar(256))
BEGIN

SELECT c.CartID, c.CartName, c.Reporter, c.Assignee, c.TimeCreated, c.DateToDelete
FROM Users u
LEFT JOIN UserGroups ug ON u.Username = ug.Username
JOIN Cart c on c.Assignee = ug.GroupName
WHERE u.Username = _Username
UNION
SELECT c.CartID, c.CartName, c.Reporter, c.Assignee, c.TimeCreated, c.DateToDelete
FROM Users u
JOIN Cart c on c.Assignee = u.Username
WHERE u.Username = _Username;

END $$

DELIMITER ;