
DROP PROCEDURE IF EXISTS CreateUser;

DELIMITER $$
CREATE PROCEDURE CreateUser
(IN _Username varchar(25), IN _HP varchar(100), IN _Email varchar(255), IN _US varchar(50),
IN _FirstName varchar(100),IN _LastName varchar(100),IN _DateCreated date)
BEGIN

DECLARE pmid INT;
select @pmid:=min(PermsID) from Permissions;
select @unique:= count(name) from
(select Username as name from Users
union
select GroupName as name from UserGroups) as s1 where s1.name=_Username;

IF @unique<=0 THEN
	INSERT INTO Users (Username, FirstName, LastName, Email, PermsID, HP, US, DateCreated, isConfirmed)  VALUES(_Username,_FirstName,_LastName,_Email,@pmid,_HP,_US,_DateCreated, default);
ELSE
	SIGNAL SQLSTATE '45000'
	SET MESSAGE_TEXT = 'User already exists in Users or UserGroups';

END IF;


END $$
DELIMITER ;
