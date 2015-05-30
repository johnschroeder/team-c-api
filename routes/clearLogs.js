var express = require("express");
var router = express.Router();
var Q = require('q');

// warning if a case is not hit, the page crashes, not sure why - Trevor
router.route("/:buttonPressed/:checkedBoxes").get(function(req,res) {
    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    var buttonNum = req.params.buttonPressed;
    var checkedBoxes = req.params.checkedBoxes;
    console.log(buttonNum);
    var query;
    var ifnotquery = "CREATE TABLE IF NOT EXISTS userLogMap " +
        "(UserID int, LogID int, FOREIGN KEY (UserID) REFERENCES Users(UserID), FOREIGN KEY (LogID) REFERENCES Logs(LogID));"
    switch (buttonNum)
    {
        case "0":
            query = "DELETE FROM userLogMap;"; break;
        case "1":
            console.log("Case 1 begin");
            var res = String(checkedBoxes).split("p");
            if (res[0] == " ") {
                console.log("res.length == 0");
                break;
            }
            var whereClause = "WHERE";
            for (i = 0; i < res.length; i++) {
                whereClause = whereClause + " logID = " + res[i] + " OR";
            }
            whereClause = whereClause + " logID = 0;";
            console.log(whereClause);

            query = "DELETE FROM userLogMap " + whereClause; break;
        default:
            query = "";
    }
    console.log("last place");
    console.log(query);
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query(ifnotquery))
        .then(db.query(query))
        .then(function(rows, columns){
            console.log("Success");
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
