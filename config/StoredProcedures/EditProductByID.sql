
DROP PROCEDURE IF EXISTS EditProductByID;

DELIMITER $$
CREATE PROCEDURE EditProductByID
(IN _ProductID INT, _ProductName varchar(255), IN _Description varchar(255))
BEGIN

UPDATE Products
SET Name = _ProductName, Description = _Description
WHERE ProductID = _ProductID;
END $$

DELIMITER ;