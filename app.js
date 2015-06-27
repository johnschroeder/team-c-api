var express = require('express');
var config = require('konfig')();
var glob = require('glob');
var redis = require('redis');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//TODO create the client using the actual host when connected to dev or prod
var client = redis.createClient();//CREATE REDIS CLIENT
client.on('connect', function() {
    console.log('connected');
});


var app = express();

//get and parse cookie and place it into req.cookies
app.use(cookieParser());


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', config.app.frontend);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(function(req,res,next)
{
    //change hardcoded cookie into whatever cookie is passed to me by the cookie parser
    //do this by changing the string to "req.cookies"
    client.exists('user1', function(err, reply) {
        if(reply == 1) {
            console.log("Successfully Authenticated!");
            next();
        }
        else{
            //TODO go to login page maybe?
            console.log("Oops, something went wrong with authentication!");
            res.status(404).send("User not Found");
        }

    });



});


var path = process.cwd()+'/routes';
glob.sync('**/*.js',{'cwd':path}).forEach(
    function(file){
        var ns = '/'+file.replace(/\.js$/,'');
        app.use(ns, require(path + ns));
    }
);
app.use('*', function(req, res){
    console.log("Error trying to display route: "+req.path);
    res.status(404).send("Nothing Found");
});


app.listen(config.app.port);


console.log('Express server running on port '+config.app.port);
