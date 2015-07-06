var express = require('express');
var config = require('konfig')();
var glob = require('glob');
var redis = require('redis');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();

// Allow headers
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

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//get and parse cookie and place it into req.cookies
app.use(cookieParser());

//These routes shouldnt be cookie tested
app.use("/Login/login", require(process.cwd()+"/routes/Login/login"));
app.use("/Login/confirmUser", require(process.cwd()+"/routes/Login/confirmUser"));
app.use("/Login/createUser", require(process.cwd()+"/routes/Login/createUser"));
app.use("/Login/testLookup", require(process.cwd()+"/routes/Login/testLookup"));


//Middleware for verifying a user is logged in before hittin a route
/*app.use(function(req,res,next)
{
    var port=config.app.redis.port;
    var host=config.app.redis.host;
    var client = redis.createClient(port,host);
    console.log(req.cookies.IMPId);
    client.exists(req.cookies.IMPId, function(err, reply) {
        if(reply == 1) {
            console.log("Successfully Authenticated!");
            next();
        }
        else{
            //TODO Have the navigation object on the login page with a window alert if this happens
            console.log("Oops, something went wrong with authentication!");
            res.status(404).send("User not Found");
        }
    });
});*/




//Adds all the routes by path to the app
var path = process.cwd()+'/routes';
glob.sync('**/*.js',{'cwd':path}).forEach(
    function(file){
        var ns = '/'+file.replace(/\.js$/,'');
        if(ns != "/login" && ns != "/Login/confirmUser" && ns != "/Login/createUser" && ns != "/Login/testLookup") {
            app.use(ns, require(path + ns));
        }
    }
);
app.use('*', function(req, res){
    console.log("Error trying to display route: "+req.path);
    res.status(404).send("Nothing Found");
});


app.listen(config.app.port);


console.log('Express server running on port '+config.app.port);
