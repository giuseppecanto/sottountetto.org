require('dotenv').load();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// modules =================================================
var express        = require('express');
var mongoose       = require('./config/mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var passport       = require('passport');
var jwt            = require('express-jwt');
var uglifyJs       = require("uglify-js");
var fs             = require('fs');
var uuid           = require('uuid');
var AWS            = require('aws-sdk');
var s3             = require('s3');
var s3fs           = require('s3fs');
var multiparty     = require('connect-multiparty');
var nodemailer     = require('nodemailer');

// configuration ===========================================
AWS.config.update({region: 'Frankfurt'});

// config files
var db  = mongoose();
var app = express();
require('./config/passport');
var multipartyMidlleware = multiparty();

var port = process.env.PORT || 8080; // set our port
// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)


var appFiles = [
    'public/js/application.js',
    'public/services/mail.service.js',
    'public/services/user.service.js',
    'public/js/common/directives/navigation/navigation.directive.js',
    'public/js/common/directives/navigation/navigation.controller.js',
    'public/controllers/signup.client.controller.js',
    'public/controllers/login.client.controller.js',
    'public/controllers/signupConfirmation.client.controller.js',
    'public/controllers/addRoof.client.controller.js',
    'public/controllers/askRoof.client.controller.js',
    'public/controllers/find.client.controller.js',
    'public/controllers/home.client.controller.js',
    'public/controllers/findProposals.client.controller.js',
    'public/controllers/findRequests.client.controller.js',
    'public/controllers/profile.client.controller.js',
    'public/controllers/deleteProfile.client.controller.js'
]

var uglified = uglifyJs.minify(appFiles, { compress : false });

fs.writeFile('public/js/sutApp.min.js', uglified.code, function (err){
    if(err) {
        console.log(err);
    } else {
        console.log('Script generated and saved: sutApp.min.js');
    }
});

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

app.use(passport.initialize()); 
app.use(multipartyMidlleware);

// routes ==================================================
require('./app/routes/user.server.routes')(app);
require('./app/routes/index.server.routes')(app);
require('./app/routes/mail.server.routes')(app);

// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app