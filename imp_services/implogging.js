var config = require("konfig")();
var displayLogs = require("./displayLogs.js");
var impredis = require("./impredis.js");

module.exports = {
    action: {},
    _type: null,
    setType: function(id){
        if(displayLogs._verifyKey(id)){
            this._type = id;
        }
        else{
            throw "Error! That type does not exist, please add it to the displayLogs service mapping"
        }
    },
    store: function(){
        impredis.get(req.cookies.IMPId, function (result, error) {
            if (err) {
                res.send("error: " + error);
            }
            else {
                var impdb = require("./impdb.js").connect();
                Q.fcall(db.beginTransaction())
                    .then(db.query("USE " + db.databaseName))
                    .then(db.query("CALL LogAction (" + this._type + ", " + result.username + ", '" + JSON.stringify(action) + "')"))
                    .then(db.commit())
                    .then(db.endTransaction())
                    .then(function(){
                        console.log("Success");
                        res.send("Success");
                    })

                    .catch(function(err){
                        Q.fcall(db.rollback())
                            .then(db.endTransaction())
                            .done();
                        console.log("Error: " + err);
                        console.error(err.stack);
                        res.status(503).send("ERROR: " + err);
                    })
                    .done();
            }
        });
    }
};
