
use imp_db_dev;
DROP PROCEDURE IF EXISTS GetUserByUsername;

DELIMITER $$
CREATE PROCEDURE GetUserByUsername(IN _Username varchar(256))
BEGIN

select * from Users where Username=_Username;

END $$
DELIMITER ;