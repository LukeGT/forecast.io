/**
    @module
*/
module.exports = function(config, url_join, request, geocode_service, WeatherModel, ErrorResponse) {

    /**
        Get a forecast at the desired address and time.

        @arg address {string} - The address for which to get weather
        @arg time {moment} - *(optional)* The time to forecast the weather for
    */
    function get_forecast(address, time) {

        return geocode_service.get_from_address(address)

        .then( function(location) {

            var coordinates = location.get_coordinates();
            var query_components = [ coordinates.latitude, coordinates.longitude ];

            if (time) {
                query_components.push(time.format('X'));
            }

            var path = query_components.join(',');

            return request({
                uri: url_join(config.url, config.api_key, path),
                qs: {
                    units: config.units,
                },
                json: true,
            });

        }).catch( function() {
            throw new ErrorResponse(503, 'The forecasting service is unavailable');

        }).then( function(data) {
            return new WeatherModel(data);
        });
    }

    return {
        get_forecast: get_forecast,
    };
};
