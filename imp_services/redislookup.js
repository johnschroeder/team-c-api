var redis = require('redis');
var config = require("konfig")();
var port=config.app.redis.port;
var host=config.app.redis.host;

module.exports = function(lookup, callback) {
    var client = redis.createClient(port, host);
    client.hgetall(lookup, function (error, val) {
        if (error !== null) {
            callback({type:"none"});
        }
        else {
            callback(val);
        }
    });
};