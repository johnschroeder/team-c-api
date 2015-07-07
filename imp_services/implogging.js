var displayLogs = require("./displayLogs.js");
var impredis = require("./impredis.js");
var Q = require('q');

module.exports = function(cookie, callback) {
    impredis.get(cookie, function (result, error) {
        if (error) {
            throw error;
        }
        else {
            callback({
                action: {},
                _type: null,
                username: (result && result.username) ? result.username : "foobarme",
                setType: function (id) {
                    if (displayLogs._verifyKey(id)) {
                        this._type = id;
                    }
                    else {
                        throw "Error! That type does not exist, please add it to the displayLogs service mapping"
                    }
                },
                store: function (callback) {
                    console.log(this);
                    var db = require("./impdb.js").connect();
                    Q.fcall(db.beginTransaction())
                        .then(db.query("USE " + db.databaseName))
                        .then(db.query("CALL LogAction ('" + this._type + "', '" + this.username + "', '" + JSON.stringify(this.action) + "')"))
                        .then(function(rows){
                            console.log("Just logged: ");
                            console.log(JSON.parse(rows[0][0].ActionData));
                        })
                        .then(db.commit())
                        .then(db.endTransaction())
                        .catch(function (err) {
                            console.log("Log Service Error: " + err);
                            console.error(err.stack);
                            Q.fcall(db.rollback())
                                .then(db.endTransaction())
                                .done();
                            callback(err, null);
                        })
                        .then(function (rows) {
                            callback(null, rows);
                        })
                        .done();
                }
            });
        }
    });
};

