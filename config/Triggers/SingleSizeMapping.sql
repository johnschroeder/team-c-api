DROP TRIGGER IF EXISTS add_single_mapping;

DELIMITER $$
CREATE TRIGGER add_single_mapping AFTER INSERT ON Products
FOR EACH ROW
BEGIN

INSERT INTO SizeMap
VALUES (null, (SELECT MAX(ProductID) FROM Products), 'single', 1);

# MAX(ProductID) might not be quite as safe as using last_insert_id(), but
# that doesn't work due to the insert of the product being outside the
# scope of the trigger

END $$
DELIMITER ;
