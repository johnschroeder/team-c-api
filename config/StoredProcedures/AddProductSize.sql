use imp_db_dev;
DROP PROCEDURE IF EXISTS AddProductSize;

DELIMITER $$
CREATE PROCEDURE  AddProductSize
(IN _ProductID int,IN _Name varchar(50), IN _Size int)
BEGIN


Insert into SizeMap values(null, _ProductID,_Name,_Size);


END $$

DELIMITER ;