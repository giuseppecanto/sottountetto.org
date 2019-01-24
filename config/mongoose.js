/**
 * Main Mongoose configuration file
 * 
 * Mongoose is a Node.js module that provides 
 * developers with the ability to model
 * objects and save them as MongoDB documents 
 */

/**
 * Getting useful paremeter from the proper
 * configuration file. 
*/
var config = require('./config'),

    // I required the Mongoose module
    mongoose = require('mongoose');

    // I created and exported a new instance of mongoDb
    module.exports = function() {
        var db = mongoose.connect(config.db);

        // Registering the Lawyer model
        require('../app/models/user.server.model');

        return db;
    };