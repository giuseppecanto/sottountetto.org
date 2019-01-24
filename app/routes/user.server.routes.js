
// Getting the User page controller
var userCtrl = require('../controllers/user.server.controller'),
    passport = require('passport');

module.exports = function(app) {
    app.route('/api/signup')
        .post(userCtrl.signup);

    app.route('/api/signup-confirmation')
        .put(userCtrl.signupConfirmation);

    app.route('/api/login')
        .post(userCtrl.login);

    app.route('/api/addRoof')
        .put(userCtrl.addRoof);

    app.route('/api/user/:userId')
        .get(userCtrl.find);

    app.route('/api/delete/:userId')
        .delete(userCtrl.delete);

    app.route('/api/users')
        .get(userCtrl.findAll);

    app.route('/api/users/proposals')
        .get(userCtrl.findProposals);

     app.route('/api/users/requests')
        .get(userCtrl.findRequests);

};