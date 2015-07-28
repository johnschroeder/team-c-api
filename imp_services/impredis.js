var redis = require('redis');
var config = require("konfig")();
var port=config.app.redis.port;
var host=config.app.redis.host;

//NOTE: Set should be called once for each value being set:
//impredis.set(key, valuename, valuecontains, callback)
module.exports = {
    get: function(key, callback) {
        var client = redis.createClient(port,host);
        client.hgetall(key, function (error, val) {
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
    set: function(key,objName,objValue, callback){
        var client = redis.createClient(port,host);
        client.hmset(key, objName,objValue,function (error, result) {
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
    },
    setExpiration: function(key, timeInHours){
        var client = redis.createClient(port,host);
        client.expire(key, timeInHours*60*60, function(){
            client.quit();
        });
    },
    delete: function(key){
        var client = redis.createClient(port,host);
        client.del(key, function(){
            client.quit();
        });
    },
    exists: function(key, callback){
        var client = redis.createClient(port,host);
        client.exists(key, function(error, result){
            if (error !== null) {
                console.log("error: " + error);
                client.quit();
                callback(error, null);
            }
            else {
                console.log(result);
                client.quit();
                callback(null, result);
            }
        });
    }
};
