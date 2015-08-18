DROP PROCEDURE IF EXISTS DeleteCart;

DELIMITER $$
CREATE PROCEDURE DeleteCart
(IN _CartID int)
BEGIN

DECLARE currentCartItemId int unsigned;
DECLARE flag boolean;

SET flag = true;

# get next cartItemID from cart
WHILE flag DO
	SELECT CartItemID
    FROM CartItems
    WHERE CartID = _CartID
    LIMIT 1
    INTO currentCartItemId;
    
    # if next cartItemID is not null, delete
    IF currentCartItemId IS NOT NULL THEN
		CALL DeleteCartItem(currentCartItemId);
	ELSE
		SET flag = false;
	END IF;
    
    SET currentCartItemId = null;
END WHILE;

# delete cart after all cart items deleted
DELETE FROM Cart
WHERE CartID = _CartID;

END $$
DELIMITER ;