
DROP PROCEDURE IF EXISTS GetPossibleAssignees;

DELIMITER $$
CREATE PROCEDURE GetPossibleAssignees()
BEGIN
SELECT GroupName as Assignee from UserGroups
union
SELECT Username as Assignee from Users;

END $$

DELIMITER ;