var redis = require('redis');
var config = require("konfig")();
var port=config.app.redis.port;
var host=config.app.redis.host;

//NOTE: Set should be called once for each value being set:
//impredis.set(key, valuename, valuecontains, callback)
module.exports = {
    get: function(cookie, callback) {
        var client = redis.createClient(port,host);
        client.hgetall(cookie, function (error, val) {
            if (error !== null) {
                console.log("error: " + error);
                client.quit();
                callback(error, null);
            }
            else {
                console.log(val);
                client.quit();
                callback(null, val);
            }
        });
    },
    set: function(cookie,objName,objValue, callback){
        var client = redis.createClient(port,host);
        client.hmset(cookie, objName,objValue,function (error, result) {
            if (error !== null) {
                console.log("error: " + error);
                client.quit();
                callback(error, null)
            }
            else {
                console.log("Success");
                client.quit();
                callback(null, result);
            }
        });
    }
};
