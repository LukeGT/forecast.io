var request = require('request');
var fs = require('fs');

module.exports = function() {

    return function(options, callback) {

        var geocode_url = 'http://maps.googleapis.com/maps/api/geocode/json';
        var forecast_address_uri = (
            'https://api.forecast.io/forecast/9a53bc525842e37f0d10dd2c650590c3' +
            '/-33.8674869,151.2069902'
        );
        var forecast_address_uri_today = (
            'https://api.forecast.io/forecast/9a53bc525842e37f0d10dd2c650590c3' +
            '/-33.8674869,151.2069902,1429688565'
        );
        var forecast_address_uri_monday = (
            'https://api.forecast.io/forecast/9a53bc525842e37f0d10dd2c650590c3/' +
            '-33.8674869,151.2069902,1430120565'
        );

        console.log(options);

        if (options.uri === geocode_url && options.qs.address === 'Sydney NSW') {
            callback(false, { statusCode: 200 }, require('./responses/geocode-address'));

        } else if (
            options.uri === 'http://maps.googleapis.com/maps/api/geocode/json' &&
            options.qs.latlng === '-33.8674869,151.2069902'
        ) {
            callback(false, { statusCode: 200 }, require('./responses/geocode-coordinates'));

        } else if (options.uri === forecast_address_uri) {
            callback(false, { statusCode: 200 }, require('./responses/forecast-address'));

        } else if (options.uri === forecast_address_uri_today) {
            callback(false, { statusCode: 200 }, require('./responses/forecast-address-today'));

        } else if (options.uri === forecast_address_uri_monday) {
            callback(false, { statusCode: 200 }, require('./responses/forecast-address-monday'));

        } else {

            /*
                Make an actual request, and write the response to disk. This simply aids building the tests, and should
                never execute during a passing test.
            */
            request(options, function(error, response, body) {

                fs.open('response.json', 'w', function(err, fd) {

                    if (err) {
                        throw new Error(err);
                    }

                    fs.write(fd, JSON.stringify(body, null, 2), function() {

                        // Fail the request
                        callback(true, response, body);
                    });
                });
            });
        }
    };
};
