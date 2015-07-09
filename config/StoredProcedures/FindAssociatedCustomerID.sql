
use imp_db_dev;
DROP PROCEDURE IF EXISTS FindAssociatedCustomerID;

DELIMITER $$
CREATE PROCEDURE FindAssociatedCustomerID(IN _ProductID INT )
BEGIN

SELECT CustomerID
FROM ProdCustMap
WHERE ProductID=_ProductID;
END $$

DELIMITER ;