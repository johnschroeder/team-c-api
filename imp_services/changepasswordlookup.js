var redis = require('redis');
var config = require("konfig")();
var port=config.app.redis.port;
var host=config.app.redis.host;

module.exports = function(lookup, callback) {
    var client = redis.createClient(port, host);
    client.get(lookup, function (error, val) {
        console.log(lookup);
        console.log(val);
        if (error !== null) {
            callback(false);
        }
        else {
            callback(val);
        }
    });
};