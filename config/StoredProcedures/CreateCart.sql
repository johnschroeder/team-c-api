DROP PROCEDURE IF EXISTS CreateCart;

DELIMITER $$
CREATE PROCEDURE CreateCart
(IN _CartName varchar(40), IN _Reporter varchar(25), IN _Assignee varchar(25), IN _KeepDays int unsigned)
BEGIN

INSERT INTO Cart
VALUES (null, _CartName, _Reporter, _Assignee, CURDATE(), DATE_ADD(CURDATE(), INTERVAL _KeepDays DAY));

END $$
DELIMITER ;