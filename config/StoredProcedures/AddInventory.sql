DROP PROCEDURE IF EXISTS AddInventory;

DELIMITER $$
CREATE PROCEDURE AddInventory
(IN _ProductID int unsigned, IN _Quantity int unsigned, IN _Location varchar(50))
BEGIN

DECLARE plid INT;

INSERT INTO Piles
VALUES (null, _ProductID, _Location);

INSERT INTO Runs
VALUES (null, LAST_INSERT_ID(), CURDATE(), _Quantity, _Quantity, 0);

END $$
DELIMITER ;