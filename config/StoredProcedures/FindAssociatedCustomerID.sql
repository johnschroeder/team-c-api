
DROP PROCEDURE IF EXISTS FindAssociatedCustomerID;

DELIMITER $$
CREATE PROCEDURE FindAssociatedCustomerID(IN _ProductID int unsigned )
BEGIN

SELECT CustomerID
FROM ProdCustMap
WHERE ProductID = _ProductID;
END $$

DELIMITER ;