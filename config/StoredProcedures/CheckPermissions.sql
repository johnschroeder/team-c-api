DROP PROCEDURE IF EXISTS CheckPermissions;

DELIMITER $$
CREATE PROCEDURE CheckPermissions
(IN _RouteToHit VARCHAR(75), IN _UserPerm int unsigned)
BEGIN
SELECT Count(*) AS PermCheck FROM RoutePermissions rp, Permissions p WHERE rp.PermsRequired= p.Perms AND p.permsID = _UserPerm AND RouteName= _RouteToHit;
END $$

DELIMITER ;