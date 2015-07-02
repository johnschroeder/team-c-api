var redis = require('redis');
var config = require("konfig")();
var port=config.app.redis.port;
var host=config.app.redis.host;


module.exports = {
    get: function(cookie, callback) {
        var client = redis.createClient(port,host);
        client.hgetall(cookie, function (error, val) {
            if (error !== null) {
                console.log("error: " + error);
                client.quit();
                callback(null, error);
            }
            else {
                console.log(val);
                client.quit();
                callback(val, null);
            }
        });
    },
    set: function(cookie, username, stateObject, callback){
        var client = redis.createClient(port,host);
        client.hmset(cookie,"Username",username,"stateObject" ,stateObject,function (error, result) {
            if (error !== null) {
                console.log("error: " + error);
                client.quit();
                callback(null, error)
            }
            else {
                console.log("Success");
                client.quit();
                callback(result, null);
            }
        });
    }
};
