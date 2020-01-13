
/*
    Application configuration:
    Reads the JSON found in root/config.json file.
    Set the default app config to development node found in config.json.
    Set the environment config to corresponding environment node found in config.json based on NODE_ENV environment variable value (which itself defaults to development if null).
    Set the final config to the union of default and environment config by calling lodash’s merge method.
    Set the global variable gConfig with the value of final config.
    Log the value of gConfig.
*/

// requires
const lodash = require('lodash')

// module variables
const config = require('./config.json')
const defaultConfig = config.local
const environment = process.env.NODE_ENV || 'local'
const environmentConfig = config[environment]
const finalConfig = lodash.merge(defaultConfig, environmentConfig)

// As a best practice all global variables should be referenced via global syntax and their names should always begin with g
global.gConfig = finalConfig
