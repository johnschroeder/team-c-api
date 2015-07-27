DROP PROCEDURE IF EXISTS StoreLocation;

DELIMITER $$
CREATE PROCEDURE StoreLocation
(IN _location varchar(25))
BEGIN

INSERT INTO Location VALUES (_location);

END $$
DELIMITER ;