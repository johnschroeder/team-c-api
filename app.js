var express = require('express');
var config = require('konfig')();
var glob = require('glob');
var redis = require('redis');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');



var app = express();
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
//TODO create the client using the actual host when connected to dev or prod, do this by adding the host and port into the createclient() function



//get and parse cookie and place it into req.cookies
app.use(cookieParser());
if(process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "prod" || process.env.NODE_ENV == "mike"){
    app.use("/login", require(process.cwd()+"/routes/login"));
}
else {
    app.get("/testRoute/", function (req, res) {
        var client = redis.createClient();
        client.set("foobarbaz", "test");
        res.cookie("IMPId", "foobarbaz", { maxAge: 24 * 60 * 60 * 1000, domain: config.app.domain, httpOnly: true });
        res.send("success");
    });
}

app.use(function(req,res,next)
{
    var client = redis.createClient();
    console.log(req.cookies.IMPId);
    client.exists(req.cookies.IMPId, function(err, reply) {
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
        if(ns != "/login") {
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
