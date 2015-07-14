var express = require('express');
var config = require('konfig')();
var glob = require('glob');
var Q = require('q');
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
    var allowed = true;
    var impredis = require("./imp_services/impredis.js");

    //TODO figure out how to get the route dynamically
    var routeToHit = "displayInventory";

    // TODO figure out how to more securely get Permission
    var UserPerm = req.cookies.IMPperm;

    //run check for if they have permission to access the route
    var db = require("./imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query("CALL CheckPermissions" + "('" + routeToHit + "'," + UserPerm + " );"))
        .then(function (rows, columns) {
            console.log("Success");
            result = rows[0][0][0];
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
    console.log("response:" + result.PermCheck);
    if(result == 1) {
        allowed = true;
    }
    impredis.exists(req.cookies.IMPId, function(err, reply) {
        if(reply == 1 && allowed) {
            console.log("Successfully Authenticated!");
            next();
        }
        else if(reply == 1 && !allowed){
            //TODO redirect to home page
            console.log("Sorry, you don't have a security level high enough to go to this page.");
            res.status(510).send("Unauthorized access attempt");
        }
        else{
            //TODO Have the navigation object on the login page with a window alert if this happens
            console.log("Oops, something went wrong with authentication!");
            res.status(511).send("User not Found");
        }
    });
});




//Adds all the routes by path to the app
var path = process.cwd()+'/routes';
glob.sync('**/*.js',{'cwd':path}).forEach(
    function(file){
        var ns = '/'+file.replace(/\.js$/,'');
        if(ns != "Permissions/CheckUserPermission" && ns != "/login" && ns != "/Login/confirmUser" && ns != "/Login/createUser" && ns != "/Login/testLookup") {
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
