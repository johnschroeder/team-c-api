
DROP PROCEDURE IF EXISTS AddInventory;

DELIMITER $$
CREATE PROCEDURE AddInventory
(IN _ProductID int unsigned, IN _Quantity int unsigned, IN _Location varchar(50))
BEGIN

DECLARE existingPileID int unsigned;
SET existingPileID = null;

# check if a pile already exists for that product and location
Select PileID
FROM Piles
WHERE ProductID = _ProductID AND Location = _Location
INTO existingPileID;

IF (existingPileID IS NULL) THEN
	# no pile exists, create new one
	INSERT INTO Piles
  	VALUES (null, _ProductID, _Location);
  
 	SET existingPileID = last_insert_id(); # get new pileId
END IF;

# create new run using either the existing pileId or a newly created pileId
INSERT INTO Runs
VALUES (null, existingPileID, CURDATE(), _Quantity, _Quantity, 0);

END $$
DELIMITER ;
