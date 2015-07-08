
use imp_db_dev;
DROP PROCEDURE IF EXISTS GetProductByID;

DELIMITER $$
CREATE PROCEDURE GetProductByID(IN _ProductID INT )
BEGIN

SELECT Name,Description
FROM Products
WHERE ProductID=_ProductID;
END $$

DELIMITER ;