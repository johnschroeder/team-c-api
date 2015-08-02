DROP PROCEDURE IF EXISTS GetAllUsers;

DELIMITER $$
CREATE PROCEDURE GetAllUsers ()
BEGIN

select * from Users WHERE Username NOT IN ("System shows");
END $$
DELIMITER ;