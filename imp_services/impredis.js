var redis = require('redis');
var config = require("konfig")();
var port=config.app.redis.port;
var host=config.app.redis.host;
var client = redis.createClient(port,host);

module.exports = {
    get: function(callback) {
        client.get(req.cookies, function (error, val) {
            if (error !== null) {
                console.log("error: " + error);
                callback(null, error);
            }
            else {
                console.log(val);
                callback(val, null);
            }
        });
    },
    set: function(stateObject, callback){
        client.set(req.cookies,stateObject,function (error, result) {
            if (error !== null) {
                console.log("error: " + error);
                callback(null, error)
            }
            else {
                console.log("Success");
                callback(result, null);
            }
        });
    }
};
