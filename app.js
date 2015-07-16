var express = require('express');
var config = require('konfig')();
var glob = require('glob');
var Q = require('q');
var paths = require('path');
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
//Middleware for verifying a user is logged in before hitting a route
var result;
app.use(function(req,res,next)
{
    var impredis = require("./imp_services/impredis.js");
    impredis.exists(req.cookies.IMPId, function(err, reply) {
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
});
app.use(function(req,res,next) {
    // Get Route that we are trying to hit
    var p = req.path;
    if (p.indexOf("/Carts/") != -1) {
        var temp = p.replace("/Carts/", "");
        var nRoute = temp.split("/")[0];
        nRoute = "/Carts/" + nRoute;
    }
    else if (p.indexOf("/Logging/") != -1) {
        var temp = p.replace("/Logging/", "");
        var nRoute = temp.split("/")[0];
        nRoute = "/Logging/" + nRoute;
    }
    else {
        var nRoute = p.split("/") [1];
        nRoute = "/" + nRoute;
    }
    var routeToHit = nRoute;
    console.log("routeToHit: " + routeToHit);
// TODO figure out how to more securely get Permission
    var impredis = require("./imp_services/impredis.js");
    impredis.get(req.cookies.IMPId, function (error, autho) {
        var UserPerm = autho.IMPperm;


        console.log("Query: CALL CheckPermissions" + "('" + routeToHit + "'," + UserPerm + " );");

//run check for if they have permission to access the route
        var db = require("./imp_services/impdb.js").connect();
        Q.fcall(db.beginTransaction())
            .then(db.query("USE " + db.databaseName))
            .then(db.query("CALL CheckPermissions" + "('" + routeToHit + "'," + UserPerm + ");"))
            .then(function (rows, columns) {
                console.log("Success");
                result = rows[0][0][0];
                console.log("response:" + result.PermCheck);
                if (result.PermCheck == 1) {
                    console.log("Access to route " + routeToHit + " granted!");
                    next();
                }
                else {

                    //TODO redirect to home page

                    console.log("Sorry, your permission level doesn't allow you to access this page.");
                    res.status(511).send("Access Denied!");
                }
            })
            .then(db.commit())
            .then(db.endTransaction())
            .catch(function (err) {
                Q.fcall(db.rollback())
                    .then(db.endTransaction());
                console.log("Error:");
                console.error(err.stack);
                res.status(503).send("ERROR: " + err.code);
            })
            .done();
    });
});

//Adds all the routes by path to the app
var path = process.cwd()+'/routes';
glob.sync('**/*.js',{'cwd':path}).forEach(
    function(file){
        var ns = '/'+file.replace(/\.js$/,'');
       //console.log("INSERT INTO RoutePermissions VALUES(\""+ ns+ "\", 3),(\""+ ns+"\", 2),(\""+ ns +"\", 1);");
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
