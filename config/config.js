
/**
 * Load the proper configuration file
 * 
 * It assumes that a NODE_ENV variable is set on the system
 * with one of the following parameters:
 * - development
 * - production
 * 
 * It load the correct configuration file based on the value
 * of the NODE_ENV variable
 */
module.exports = require('./env/' + process.env.NODE_ENV + '.js');