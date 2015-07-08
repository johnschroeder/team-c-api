
use imp_db_dev;
DROP PROCEDURE IF EXISTS GetCustomers;

DELIMITER $$
CREATE PROCEDURE GetCustomers()
BEGIN

SELECT CustomerID, Name FROM Customers;

END $$

DELIMITER ;
