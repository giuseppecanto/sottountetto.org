/**
 * For the UserSchema
  object rely on:
 * Mongoose Documentation: http://mongoosejs.com/docs/2.7.x/index.html
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    jwt = require('jsonwebtoken');

    var HomeSubSchema = new Schema({
            purpose: { type:String },
            address:{ type:String },
            location:{ "lat": {type:Number}, "lng": {type:Number} },
            numBed: { type: Number }
        }, { _id: false });
    
    var UserSchema = new Schema({
        firstname: {
            type: String
        },
        email: {
            type: String,
            match: [/.+\@.+\..+/, "Please fill a valid e-mail address"],
            unique: true
        },
        telephone: {
            type: String,
        },
        password: {
            type: String,
            validate: [
                function(password) {
                    return password && password.length > 6;
                }, 'La password deve essere di una lunghezza maggiore.' 
            ]
        },
        salt: {
            type: String
        },
        hash: {
            type: String
        },
        picture: {
            type: String
        },
        image: {
            ext: { type:String }
        },
        home: HomeSubSchema,
        enabled: {
            type: Boolean,
            default: false
        }
    });

    UserSchema.methods.setPassword = function(password) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 1000,64).toString('base64');
    };

    UserSchema.methods.validPassword = function(password) {
        var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('base64');
        return this.hash === hash;
    };
    
    UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
        var _this = this;
        var possibleUsername = username + (suffix || '');
        _this.findOne({
            username: possibleUsername
        }, function(err, UserSchema
) {
            if (!err) {
                if (!UserSchema
        ) {
                    callback(possibleUsername);
                } else {
                    return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
                }
            } else {
                    callback(null);
            }
        });
    };

    // Generate the JSON WEB TOKEN
    UserSchema.methods.generateJwt = function() {
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);

        return jwt.sign({
            _id: this._id,
            email: this.email,
            firstname: this.firstname,
            exp: parseInt(expiry.getTime() / 1000),
        }, process.env.JWT_SECRET);
    };

    mongoose.model('User', UserSchema);