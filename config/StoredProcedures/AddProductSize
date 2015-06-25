# Used to add an entry to the SizeMap table
# usage: CALL AddProductSize(101, "BigBundle", 200);

USE imp_db_dev;
DROP PROCEDURE IF EXISTS AddProductSize;

DELIMITER $$
CREATE PROCEDURE AddProductSize
(IN _ProductID int unsigned, IN _Name varchar(50), IN _Size int unsigned)
BEGIN

INSERT INTO SizeMap
VALUES (null, _ProductID, _Name, _Size);

END $$
DELIMITER ;