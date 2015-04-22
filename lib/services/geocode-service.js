/**
    Uses Google's geocoding service to convert latitude/longitude coordinates into addresses and vice-versa.
    @module
*/

module.exports = function(config, request, LocationModel, ErrorResponse) {

    var geocode_request = function(query) {

        return request({
            uri: config.url,
            qs: query,
            json: true,

        }).catch( function() {
            throw new ErrorResponse(503, 'Geocoding service is unavailable');

        }).then( function(response) {
            return new LocationModel(response.results[0]);
        });
    };

    /**
        Convert latitude/longitude coordinates into a human readable address.
        @function
        @static
        @arg {Number} latitude - The target latitude
        @arg {Number} longitude - The target longitude
    */
    function get_from_coordinates(latitude, longitude) {

        return geocode_request({
            latlng: [ latitude, longitude ].join(','),
        });
    }

    /**
        Convert a human readable address into latitude/longitude coordinates.
        @function
        @static
        @arg {string} address - Human readable address
    */
    function get_from_address(address) {

        return geocode_request({
            address: address,
        });
    }

    return {
        get_from_coordinates: get_from_coordinates,
        get_from_address: get_from_address,
    };
};
