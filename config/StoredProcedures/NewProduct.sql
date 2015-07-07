
use imp_db_dev;
DROP PROCEDURE IF EXISTS NewProduct;

DELIMITER $$
CREATE PROCEDURE NewProduct
(IN _ProductName varchar(255), IN _Description varchar(255),IN _Date date)
BEGIN

insert into Products values
(null, _ProductName,_Description,_Date, 1);

SELECT LAST_INSERT_ID() as ProductID;

END $$

DELIMITER ;