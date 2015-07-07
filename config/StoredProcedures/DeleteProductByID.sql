use imp_db_dev;
DROP PROCEDURE IF EXISTS DeleteProductByID;

DELIMITER $$
CREATE PROCEDURE DeleteProductByID(IN _ProductID INT unsigned)
BEGIN

set @msg='Success';

#check if there are inventory associated with this productID
SELECT @Quantity:=sum(QuantityReserved+QuantityAvailable)#, Piles.ProductID
FROM Piles
join Runs on Runs.PileID = Piles.PileID
where ProductID=_ProductID
group by Piles.ProductID;

#check if customers are associated with this productID
#let delete go through even if the product is associated with customers
#select @countInCustomers:=count(*) from ProdCustMap where ProductID=_ProductID;

#delete sizemap entries or not?

IF @Quantity=0 THEN
	UPDATE Products SET ViewOption=0 WHERE ProductID = _ProductID;
ELSE
	set @msg='Error: Inventory exists for this product';
END IF;
select @msg as message;

END $$
DELIMITER ;
