
// Requiring the passport module
var passport = require('passport'),

    // The local strategy object
    LocalStrategy = require('passport-local').Strategy,

    // User mongoose model
    User = require('mongoose').model('User');

module.exports = function() {

    // Registering the strategy using passport.use() method
    passport.use(new LocalStrategy(function(username, password, done) {

    // Searching the user with specified username and trying to authenticate him
    User.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                message: 'Unknown user'
            });
        }

        if (!user.authenticate(password)) {
            return done(null, false, {
                message: 'Invalid password'
            });
        }

        return done(null, user);
        });
    }));
};