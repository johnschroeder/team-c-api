var displayLogs = require("./displayLogs.js");
var impredis = require("./impredis.js");
var Q = require('q');

module.exports = function(cookie) {
    impredis.get(cookie, function (result, error) {
        if (error) {
            throw error;
        }
        else {
            return {
                action: {},
                _type: null,
                username: result ? result.username : "foobarme",
                setType: function (id) {
                    if (displayLogs._verifyKey(id)) {
                        this._type = id;
                    }
                    else {
                        throw "Error! That type does not exist, please add it to the displayLogs service mapping"
                    }
                },
                store: function (cookie, callback) {
                    console.log(this);
                    var db = require("./impdb.js").connect();
                    var type = this._type;
                    var action = this.action;
                    Q.fcall(db.beginTransaction())
                        .then(db.query("USE " + db.databaseName))
                        .then(db.query("CALL LogAction ('" + type + "', '" + username + "', '" + JSON.stringify(action) + "')"))
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
            }
        }
    });
};

