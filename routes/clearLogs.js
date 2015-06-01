var express = require("express");
var router = express.Router();
var Q = require('q');

// warning if a case is not hit, the page crashes, not sure why - Trevor
router.route("/:buttonPressed/:checkedBoxes").get(function(req,res) {
    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    var buttonNum = req.params.buttonPressed;
    var checkedBoxes = req.params.checkedBoxes;

    var query;
    var ifnotquery = "CREATE TABLE IF NOT EXISTS userLogMap " +
        "(UserID int, LogID int, FOREIGN KEY (UserID) REFERENCES Users(UserID), FOREIGN KEY (LogID) REFERENCES Logs(LogID));"

    var removeList = String(checkedBoxes).split("p");
    switch (buttonNum)
    {
        case "0":
            query = "DELETE FROM userLogMap;"; break;
        case "1":
            // console.log("Case 1 begin");

            if (removeList[0] == " ") { // This is SUPPOSE to protect us from the case of the button being pressed w/o checks [hopefully]
                removeList[0] = '0';
            }
            var whereClause = "WHERE";

            for (i = 0; i < removeList.length; i++) {
                whereClause = whereClause + " logID = " + removeList[i] + " OR";
            }
            whereClause = whereClause + " logID = 0;"; // doesn't do anything just makes the sql statement clean
            console.log(whereClause);
            query = "DELETE FROM userLogMap " + whereClause; break;
        default:
            query = "SELECT * FROM userLogMap WHERE logID = 0;"; // This shouldn't do anything.
    }

    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query(ifnotquery))
        .then(db.query(query))
        .then(function(rows, columns){
            console.log("Success");
            res.send();
            db.endTransaction();
        })
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction());
            console.log("Error:");
            console.error(err.stack);
            res.status(503).send("ERROR: " + err.code);
        })
        .done();

});

module.exports = router;
