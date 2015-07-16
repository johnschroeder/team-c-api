DROP PROCEDURE IF EXISTS GetAllPermissions;

DELIMITER $$
CREATE PROCEDURE GetAllPermissions ()
BEGIN

select * from Permissions;
END $$
DELIMITER ;