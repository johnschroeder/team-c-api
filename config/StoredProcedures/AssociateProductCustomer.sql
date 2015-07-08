
use imp_db_dev;
DROP PROCEDURE IF EXISTS AssociateProductCustomer;

DELIMITER $$
CREATE PROCEDURE AssociateProductCustomer
(IN _ProductName INT, IN _CustomerName INT)
BEGIN

INSERT INTO ProdCustMap VALUES(_ProductName, _CustomerName);

END $$

DELIMITER ;