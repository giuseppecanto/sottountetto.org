module.exports = function(app) {

    // Requiring the NodeJS built-in path module: https://nodejs.org/dist/latest-v4.x/docs/api/path.html
    var path    = require('path');
    var jwt     = require('express-jwt');
    var auth    = jwt({secret: process.env.JWT_SECRET, lawyerProperty: 'payload'});

    /**
     * When a HTTP GET request comes to the root path I call a callback function
     * The callback function link to the index.html AngularJS view
     * 
     * Documentation: http://expressjs.com/en/api.html#app.get.method
     * StackOverflow: http://stackoverflow.com/questions/25463423/res-sendfile-absolute-path
     */  
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '../../public/', 'index.html'));
    })

}