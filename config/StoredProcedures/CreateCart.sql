
use imp_db_dev;
DROP PROCEDURE IF EXISTS CreateCart;

DELIMITER $$
CREATE PROCEDURE CreateCart
(IN _CartName varchar(40), IN _Reporter varchar(25),IN _Assignee varchar(25),IN _KeepDays INT)
BEGIN



END $$

DELIMITER ;