var redis = require('redis');
var config = require("konfig")();
var port=config.app.redis.port;
var host=config.app.redis.host;
var client = redis.createClient(port,host);

//NOTE: Set should be called once for each value being set:
//impredis.set(key, valuename, valuecontains, callback)
module.exports = {
    get: function(cookie,callback) {
        client.hgetall(cookie, function (error, val) {
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
    set: function(cookie,objName,objValue, callback){
        client.hmset(cookie, objName,objValue,function (error, result) {
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
