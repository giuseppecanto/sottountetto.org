// Getting the user model using Mongoose
var User = require('mongoose').model('User'),
    passport = require('passport'),
    AWS = require('aws-sdk'),
    uuid = require('uuid'),
    multiparty = require('connect-multiparty'),
    fs = require('fs'),
    s3fs = require('s3fs'),
    s3fsImpl = new s3fs('avvocatodirettobucket', { accessKeyId: 'AKIAITQKOTI2UQH6JNTQ', secretAccessKey: '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' });
    var multipartyMidlleware = multiparty();
    AWS.config.loadFromPath('config/aws.json');

// Adding a common function to send JSON responses
var sendJSONresponse = function(res, status, content){
    res.status(status);
    res.json(content); 
};

exports.signup = function(req, res){

    var user = new User();
    //Setting the attributes of the new created user object 
     user.firstname = req.body.firstname;
     user.email = req.body.email;
     user.setPassword(req.body.password);
     user.home = {};
     
     user.save(function(err){
         if (err) {
             sendJSONresponse(res, 404, err);
        } else {
            // searching the user just created to retrieve _id and send it back
            User.findOne({ email : req.body.email },
                function(err, user) {
                    if (err) { sendJSONresponse(res, 404, err); }
                    else { sendJSONresponse(res, 200, { _id: user._id }); }
            });
         }
     });

}

exports.signupConfirmation = function(req, res) {

    // Validating request
    if(!req.body.userId){
        sendJSONresponse(res, 404, { "message": "Errore" });
        return;
    }

    User
        .findById(req.body.userId)
        .exec(function(err, user) {
            user.enabled = true;
            
            user.save(function(err, user){
                if (err) { sendJSONresponse(res, 404, err); }
                else { sendJSONresponse(res, 200, { "message": "User enabled to login." } ); }
            });
        });

}

exports.login = function(req, res) {
    
    // Validating request
    if (!req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, { "message": "All fields required." });
        return;
    }
    
    passport.authenticate('local', function(err, user, info){
        var token;

        if (err) {
            sendJSONresponse(res, 404, err);
            return;
        }

        if (user && user.enabled){
            token = user.generateJwt();
            sendJSONresponse(res, 200, {
                "token": token
            });
        } else { sendJSONresponse(res, 401, { "message": "Non hai accesso a questo portale. Hai gia' confermato il tuo account?" }); }

    })(req, res);

}

exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Find a user to load his page
 * 
 * The function return a user object on success (200) 
 * The function return an error message on unsuccess (404)
 */
exports.find = function(req, res) {

    //Check that userId exists in request parameters
    if(req.params && req.params.userId) {
        User
            .findById(req.params.userId)
            .exec(function(err, user){

                //If mongoose does not return a user sends 404 message
                if (!user){
                    sendJSONresponse(res, 404, { "message": "userId non trovato." });
                    return;
                

                //If mongoose return an error sends 404 err message
                } else if(err){
                    sendJSONresponse(res, 404, err);
                    return;
                }

                //If everything is good sends 200 success user object
                sendJSONresponse(res, 200, user);
            });
    } else {
        sendJSONresponse(res, 404, { "message": "Nessun userId nella richiesta." });
    }
};

exports.addRoof = function(req, res){

    if(req.body.formData && req.body.userId){
        User
            .findById(req.body.userId)
            .exec(function(err, user) {
                user.home.address = req.body.formData.address;
                user.home.location = req.body.formData.location;
                user.home.numBed = req.body.formData.numBed;
                user.home.purpose = req.body.formData.purpose;

                user.save(function(err, user){
                    var token;

                    if(err) { sendJSONresponse(res, 404, { "message": "Errore interno del database." }); }
                    else {
                        token = user.generateJwt();
                        sendJSONresponse(res, 200, { "token":token });
                    }
                });
            });
    } else {
        sendJSONresponse(res, 404, { "message": "Errore nella validita' dei dati inviati." });
    }

}

exports.delete = function(req, res){
    
    if(req.params && req.params.userId) {
        User
            .findByIdAndRemove(req.params.userId)
            .exec(
                function(err, user) {
                    if(err) {
                        sendJSONresponse(res, 404, err);
                        return;
                    }
                    else { sendJSONresponse(res, 200, null); }
                }
    )} else {
        sendJSONresponse(res, 204, { "message": "Nessun avvocatoId ricevuto." });
    }

}

exports.upload = function(req, res) {
    //Initializing variables for file (name, extension)
    var file = req.files.file;
    file.filename = req.params.avvocatoId;
    file.ext = file.originalFilename.split('.')[1];
    
    var stream = fs.createReadStream(file.path);
    s3fsImpl.writeFile(file.filename + "." + file.ext, stream)
        .then(function(){
            fs.unlink(file.path, function(err){
                if (err)
                    console.error(err);
            }) 
    });

    User
        .findById(req.params.avvocatoId)
        .exec(function(err, user) {
            user.image.ext = file.ext;

            user.save(function(err, user){
                var token;

                if(err) { sendJSONresponse(res, 404, err); }
                else {
                    token = user.generateJwt();
                    sendJSONresponse(res, 200, {"token":token});
                }
            });
        });

}

exports.findAll = function(req, res) {

    User
        .find()
        .exec(function(err, users){
            if (err) {
               sendJSONresponse(res, 404, err);
               return;
            } else {
                sendJSONresponse(res, 200, users);
            }
        });

}

exports.findProposals = function(req, res) {

    User
        .find({ $where : "this.home.purpose == 'proposte' " })
        .exec(function(err, users){
            if (err) {
               sendJSONresponse(res, 404, err);
               return;
            } else {
                sendJSONresponse(res, 200, users);
            }
        });
}

exports.findRequests = function(req, res) {

    User
        .find({ $where : "this.home.purpose == 'richieste' " })
        .exec(function(err, users){
            if (err) {
               sendJSONresponse(res, 404, err);
               return;
            } else {
                sendJSONresponse(res, 200, users);
            }
        });
}

exports.filterBy = function(req, res) {

    //Validating request
    if (!req.params || !req.params.filter) {
        sendJSONresponse(res, 404, { "message": "Categoria non selezionata correttamente." } );
        return;
    }

    //Setting the trasformation of the categories names
    var filter = req.params.filter;
    switch(filter){
        case "dirittoFamiglia":
            filter = 'Diritto di famiglia'
            break;
        case "dirittoTributario":
            filter = 'Diritto tributario'
            break;
        case "ediliziaUrbanistica":
            filter = 'Ediliza, Urbanistica'
            break;
        case "infortunisticaStradale":
            filter = 'Infortunistica stradale'
            break;
        case "dirittoAmministrativo":
            filter = 'Diritto amministrativo'
            break;
        case "dirittoCommerciale":
            filter = 'Diritto commerciale'
            break;
        case "dirittoInternazionale":
            filter = 'Diritto internazionale'
            break;
        case "dirittoSportivo":
            filter = 'Diritto sportivo'
            break;
        case "infortunisticaLavoro":
            filter = 'Infortunistica sul lavoro'
            break;
        case "lavoroControversie":
            filter = 'Lavoro controversie'
            break;
        case "locazioneImmobili":
            filter = 'Locazione immobili'
            break;
        case "processoCivile":
            filter = 'Processo civile'
            break;
        case "processoPenale":
            filter = 'Processo penale'
            break;
        case "separazioneDivorzio":
            filter = 'Separazione e divorzio'
            break;
        case "societa":
            filter = 'Societa'
            break;
        case "tutelaConsumatori":
            filter = 'Tutela consumatori'
            break;
        default:
            filter = ''
    }

    //Validating the parsing
    if (filter == '') {
        sendJSONresponse(res, 404, { "message": "Errore del sistema #0025. Contatta subito l'help desk e comunicando questo codice riceverai assistenza. Ci scusiamo per l'incidente." } );
        return;
    }

    User
        .find({ categorie: { name: filter, value: true } }) 
        .exec(function(err, users){

            //If mongoose does not return a user sends 404 message
                if (!users){
                    sendJSONresponse(res, 404, { "message": "La ricerca non ha restituito alcun avvocato." });
                    return;

            //If mongoose return an error sends 404 err message
                } else if(err){
                    sendJSONresponse(res, 404, err);
                    return;
                }

            //If everything is good sends 200 success user object
                sendJSONresponse(res, 200, users);
        }); 
}

exports.findAllSL = function(req, res) {

    User
        .find({ tipo: 'studiolegale' })
        .exec(function(err, users){
            if (err) {
                return res.status(400).send({ message: getErrorMessage(err) });
            } else {
                sendJSONresponse(res, 200, users);
            }
        });

}

exports.SLfilterBy = function(req, res) {

    //Validating request
    if (!req.params || !req.params.filter) {
        sendJSONresponse(res, 404, { "message": "Categoria non selezionata correttamente." } );
        return;
    }

    //Setting the trasformation of the categories names
    var filter = req.params.filter;
    switch(filter){
        case "dirittoFamiglia":
            filter = 'Diritto di famiglia'
            break;
        case "dirittoTributario":
            filter = 'Diritto tributario'
            break;
        case "ediliziaUrbanistica":
            filter = 'Ediliza, Urbanistica'
            break;
        case "infortunisticaStradale":
            filter = 'Infortunistica stradale'
            break;
        case "dirittoAmministrativo":
            filter = 'Diritto amministrativo'
            break;
        case "dirittoCommerciale":
            filter = 'Diritto commerciale'
            break;
        case "dirittoInternazionale":
            filter = 'Diritto internazionale'
            break;
        case "dirittoSportivo":
            filter = 'Diritto sportivo'
            break;
        case "infortunisticaLavoro":
            filter = 'Infortunistica sul lavoro'
            break;
        case "lavoroControversie":
            filter = 'Lavoro controversie'
            break;
        case "locazioneImmobili":
            filter = 'Locazione immobili'
            break;
        case "processoCivile":
            filter = 'Processo civile'
            break;
        case "processoPenale":
            filter = 'Processo penale'
            break;
        case "separazioneDivorzio":
            filter = 'Separazione e divorzio'
            break;
        case "societa":
            filter = 'Societa'
            break;
        case "tutelaConsumatori":
            filter = 'Tutela consumatori'
            break;
        default:
            filter = ''
    }

    //Validating the parsing
    if (filter == '') {
        sendJSONresponse(res, 404, { "message": "Errore del sistema #0025. Contatta subito l'help desk e comunicando questo codice riceverai assistenza. Ci scusiamo per l'incidente." } );
        return;
    }

    User
        .find({tipo: 'studiolegale', categorie: { name: filter, value: true } }) 
        .exec(function(err, users){

            //If mongoose does not return a user sends 404 message
                if (!users){
                    sendJSONresponse(res, 404, { "message": "La ricerca non ha restituito alcuno studio legale." });
                    return;

            //If mongoose return an error sends 404 err message
                } else if(err){
                    sendJSONresponse(res, 404, err);
                    return;
                }

            //If everything is good sends 200 success user object
                sendJSONresponse(res, 200, users);
        });

}