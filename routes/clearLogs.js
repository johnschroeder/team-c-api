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
    console.log("Clear Logs - button pressed = " + buttonNum + " checkedBoxes = " + checkedBoxes);
    switch (buttonNum)
    {
        case "0":
            console.log("Clear Logs - Case 0 begin");
            query = "DELETE FROM UserLogMap WHERE UserID = 1;"; break;
        case "1":
            console.log("Clear Logs - Case 1 begin");
            var removeList = String(checkedBoxes).split("p");
            if (removeList[0] == " ") { // This is SUPPOSE to protect us from the case of the button being pressed w/o checks [hopefully]
                removeList[0] = '0'; // zero is not used as a logID
            }
            var whereClause = "WHERE UserID = 1 AND (";

            for (i = 0; i < removeList.length; i++) {
                whereClause = whereClause + " logID = " + removeList[i] + " OR";
            }
            whereClause = whereClause + " logID = 0);"; // doesn't do anything just makes the sql statement clean
            console.log(whereClause);
            query = "DELETE FROM UserLogMap " + whereClause; break;
        default:
            query = "SELECT * FROM UserLogMap WHERE logID = 0;"; // This shouldn't do anything.
    }
console.log (query);
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
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
