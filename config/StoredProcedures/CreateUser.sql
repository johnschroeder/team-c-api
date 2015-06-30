
use imp_db_dev;
DROP PROCEDURE IF EXISTS CreateUser;

DELIMITER $$
CREATE PROCEDURE CreateUser
(IN _Username varchar(25), IN _HP varchar(100), IN _Email varchar(255), IN _US varchar(50),
IN _FirstName varchar(100),IN _LastName varchar(100),IN _DateCreated date)
BEGIN

DECLARE pmid INT;
select @pmid:=min(PermsID) from Permissions;

INSERT INTO Users VALUES(_Username,_FirstName,_LastName,_Email,@pmid,_HP,_US,_DateCreated);

END $$
DELIMITER ;