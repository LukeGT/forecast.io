var dependencies = require('./lib/dependencies');

module.exports = {

    // node_modules dependencies
    lodash: {
        module: dependencies.require('lodash'),
    },
    moment: {
        module: dependencies.require('moment'),
    },
    url_join: {
        module: dependencies.require('url-join'),
    },
    Q: {
        module: dependencies.require('q'),
    },
    request: {
        module: dependencies.require('request'),
    },
    express: {
        module: dependencies.require('express'),
    },
    path: {
        module: dependencies.require('path'),
    },
    sass_middleware: {
        module: dependencies.require('node-sass-middleware'),
    },
    bourbon: {
        module: dependencies.require('node-bourbon'),
    },
    domain: {
        module: dependencies.require('domain'),
    },

    // server
    server: {
        module: require('./lib/server'),
        dependencies: [
            'config_server',
            'express',
            'sass_middleware',
            'bourbon',
            'landing_page',
            'geocode_routes',
            'forecastio_routes',
            'domain_wrapper',
            'error_handler',
        ],
    },

    // routes
    geocode_routes: {
        module: require('./lib/routes/geocode-routes'),
        dependencies: [ 'geocode_service', 'accept_types', 'ErrorResponse', 'url_join' ],
    },
    forecastio_routes: {
        module: require('./lib/routes/forecastio-routes'),
        dependencies: [
            'config_forecastio',
            'forecastio_service',
            'accept_types',
            'ErrorResponse',
            'url_join',
            'lodash',
            'date_utils',
        ],
    },
    landing_page: {
        module: require('./lib/routes/landing-page'),
        dependencies: [ 'accept_types' ],
    },

    // middleware
    accept_types: {
        module: require('./lib/middleware/accept-types'),
        dependencies: [ 'lodash', 'ErrorResponse' ],
    },
    error_handler: {
        module: require('./lib/middleware/error-handler'),
        dependencies: [ 'ErrorResponse' ],
    },
    domain_wrapper: {
        module: require('./lib/middleware/domain-wrapper'),
        dependencies: [ 'domain' ],
    },

    // errors
    ErrorResponse: {
        module: require('./lib/errors/error-response'),
    },

    // services
    icon_service: {
        module: require('./lib/services/icon-service'),
        dependencies: [ 'config_icons' ],
    },
    forecastio_service: {
        module: require('./lib/services/forecastio-service'),
        dependencies: [
            'config_forecastio',
            'url_join',
            'request_promise',
            'geocode_service',
            'WeatherModel',
            'ErrorResponse',
        ],
    },
    geocode_service: {
        module: require('./lib/services/geocode-service'),
        dependencies: [ 'config_geocode', 'request_promise', 'LocationModel', 'ErrorResponse' ],
    },

    // models
    LocationModel: {
        module: require('./lib/models/location-model'),
        dependencies: [ 'config_geocode', 'lodash' ],
    },
    WeatherModel: {
        module: require('./lib/models/weather-model'),
        dependencies: [ 'config_forecastio', 'moment', 'icon_service' ],
    },

    // config
    config_geocode: {
        module: dependencies.wrap(require('./config').geocode),
    },
    config_forecastio: {
        module: dependencies.wrap(require('./config').forecastio),
    },
    config_icons: {
        module: dependencies.wrap(require('./config').icons),
    },
    config_server: {
        module: dependencies.wrap(require('./config').server),
    },

    // utils
    request_promise: {
        module: require('./lib/utils/request'),
        dependencies: [ 'Q', 'request' ],
    },
    date_utils: {
        module: require('./lib/utils/date-utils'),
        dependencies: [ 'moment' ],
    },
};
