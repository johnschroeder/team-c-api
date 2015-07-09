
use imp_db_dev;
DROP PROCEDURE IF EXISTS AddCustomer;

DELIMITER $$
CREATE PROCEDURE AddCustomer
(IN _CustomerName varchar(255))
BEGIN

INSERT INTO Customers VALUES(null, _CustomerName, CURDATE());

SELECT LAST_INSERT_ID() AS CustomerID;

END $$

DELIMITER ;