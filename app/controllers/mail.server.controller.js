// Getting dependecies ===========================
var nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport  
var transporter = nodemailer.createTransport('smtps://hello@sottountetto.org:NXWtBEEZn*2m<{)H@ophelia.secure.kgix.net');

// Setting a common function to send JSON Responses
var sendJSONresponse = function(res, status, content){
    res.status(status);
    res.json(content); 
};

exports.sendMail = function(req, res) {
    
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"' + req.body.name + '"' + ' ' + '<' + req.body.email + '>', // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.message // plaintext body
        //html: '<b>Hello world 🐴</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            sendJSONresponse(res, 400, error);
            return;
        }
        console.log('Message sent: ' + info.response);
        sendJSONresponse(res, 250, info.response);
    });
       
}
