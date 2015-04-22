/**

Exposes a number of endpoints which allow for easy retrieval of forecast information at human-readable addresses
for the next week. Depending on the Accept header from the client, either an HTML or JSON response can be provided.
HTML takes precedence over JSON if both are acceptable.

Information regarding the structure of the JSON responses can be found on the
[forecast.io docs](https://developer.forecast.io/docs/v2).

    @module
*/

module.exports = function(config, forecastio_service, accept_types, ErrorResponse, url_join, _, date_utils) {

    /**
        Collects the duplicated functionality across the response of the 3 route methods defined in this module
        @arg {Request} req
        @arg {Response} res
        @arg {string} - Either 'single' or 'multi', depending on the desired view of the weather data
    */
    function handle_response(req, res, days) {

        return function(weather) {

            if (req.accept_type === 'json') {
                res.send(weather.serialize());

            } else if (req.accept_type === 'html') {

                if (days === 'single') {
                    res.render('single', {
                        location: req.params.address,
                        weather_summary: weather.get_daily_weather()[0],
                        hourly_weather: weather.get_hourly_weather().slice(0, 24),
                    });

                } else if (days === 'multi') {
                    res.render('multi', {
                        location: req.params.address,
                        daily_weather: weather.get_daily_weather(),
                    });
                }

            } else {
                throw new Error('Unexpected Accept type encountered');
            }
        };
    }

    /**

```
GET /<prefix>/:address
```

Retrives the week's daily weather summary at the given address.

        @arg {Request} req
        @param {string} req.params.address - A plain text, human readable address
        @arg {Response} res
    */
    function at_address(req, res) {
        forecastio_service.get_forecast(req.params.address)
        .then(handle_response(req, res, 'multi'))
        .done();
    }

    /**

```
GET /<prefix>/:address/today
```

Retrives an hourly summary of today's weather at the given address.

        @arg {Request} req
        @param {string} req.params.address - A plain text, human readable address
        @arg {Response} res
    */
    function at_address_today(req, res) {
        forecastio_service.get_forecast(req.params.address, date_utils.get_today())
        .then(handle_response(req, res, 'single'))
        .done();
    }

    /**

```
GET /<prefix>/:address/:weekday
```

Retrives an hourly summary of the given weekday's weather at the given address. The day chosen will always be the next
day in the future.

        @arg {Request} req
        @param {string} req.params.address - A plain text, human readable address
        @param {string} req.params.weekday - The day of the week to retrive the forecast for
        @arg {Response} res
    */
    function at_address_weekday(req, res) {

        if (!_.includes(config.valid_weekdays, req.params.weekday)) {
            throw new ErrorResponse(400, 'Weekday must be unabbreviated and in lower case.');
        }

        forecastio_service.get_forecast(req.params.address, date_utils.get_weekday(req.params.weekday))
        .then(handle_response(req, res, 'single'))
        .done();
    }

    /**
        Attaches the necessary routes to the `app` passed in, prefixes with the string passed in as `prefix`.

        @arg {string} prefix - This string will be prepended to all of this module's routes. e.g. `'/weather'`
        @arg {App} app - An instance of an express.js application
    */
    function route_app(prefix, app) {
        app.use(prefix, accept_types(['html', 'json']));
        app.get(url_join(prefix, '/:address'), at_address);
        app.get(url_join(prefix, '/:address/today'), at_address_today);
        app.get(url_join(prefix, '/:address/:weekday'), at_address_weekday);
    }

    return {
        route_app: route_app,
        at_address: at_address,
        at_address_today: at_address_today,
        at_address_weekday: at_address_weekday,
    };
};

