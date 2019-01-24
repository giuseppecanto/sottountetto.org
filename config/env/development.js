/**
 * Configuration file for development deployment
 * it is loaded only on local host
 */
module.exports = {
    // Development configuration options

    /**
     * For security reasons, it is recommended that the cookie secret be different
     * for each environment
     */
    sessionSecret: 'sutSessionSecret',

    /**
     * Saving the URI directly in the config/express.js file 
     * is a bad practice. The proper way to store application
     * variables is to use your enviornment configuration file
     */
    db: 'mongodb://localhost/sut-db'
}