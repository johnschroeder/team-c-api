use imp_db_dev;
DROP PROCEDURE IF EXISTS DeleteProductByID;

DELIMITER $$
CREATE PROCEDURE DeleteProductByID(IN _ProductID INT unsigned, OUT _msg varchar(500))
BEGIN

set _msg='Success';

#check if there are inventory associated with this productID
select @countInPile:=count(*) from Piles where ProductID=_ProductID;

#check if customers are associated with this productID
select @countInCustomers:=count(*) from ProdCustMap where ProductID=_ProductID;

#delete sizemap entries or not?

IF @countInPile=0 and @countInCustomers=0 THEN
	UPDATE Products SET ViewOption=0 WHERE ProductID = _ProductID;
ELSEIF @countInPile!=0 THEN
	set _msg='Error: Inventory exists for this product';
else
	set _msg='Error: Customers are associated with this product';
END IF;

END $$
DELIMITER ;
