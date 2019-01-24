
//Getting dependencies
var mailCtrl = require('../controllers/mail.server.controller.js');

module.exports = function(app) {

    app.route('/api/mail')
        .post(mailCtrl.sendMail);

}