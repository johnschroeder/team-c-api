/**
 * Created by Kun on 6/28/2015.
 */

var redis = require("redis");
var client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});
// Set a value
client.set("ck1", "yoyoyoyo", redis.print);
// Get the value back
client.get("string key", function (err, reply) {
    console.log(reply.toString());
});
// Clean quit (waits for client to finish)
client.quit();