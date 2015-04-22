/**

Exposes a number of endpoints which allow for easy retrieval of geocoding data. Data can be retrieved either by
specifying a plaintext address, or by providing longitude and latitude coordinates. All responses are in JSON
format, and are structured as below.

    {
        "address": "Brief address containing broad information",
        "coordinates": {
            "latitude": -33.2345234,
            "longitude": -121.243275
        }
    }

    @module
*/

module.exports = function(geocode_service, accept_types, ErrorResponse, url_join) {

    /**

```
GET /<prefix>/coordinates?longitude&latitude
```

Retrieves geocoding information given a set of longitude and latitude coordinates

        @arg {Request} req
        @param {string} req.query.latitude - The latitude of the location
        @param {string} req.query.longitude - The longitude of the location
        @arg {Response} res
    */
    function from_coordinates(req, res) {

        if (!req.query.latitude) {
            throw new ErrorResponse(400, 'You must supply a latitude');

        } else if (!req.query.longitude) {
            throw new ErrorResponse(400, 'You must supply a longitude');
        }

        geocode_service.get_from_coordinates(req.query.latitude, req.query.longitude)

        .then( function(location) {
            res.send(location.serialize());

        }).done();
    }

    /**
```
GET /<prefix>/address?q
```

Retrieves geocoding information given a human-readable address.

        @arg {Request} req
        @param {string} req.query.q - Human-readable address of the location
        @arg {Response} res
    */
    function from_address(req, res) {

        if (!req.query.q) {
            throw new ErrorResponse(400, 'You must supply a query parameter "q"');
        }

        geocode_service.get_from_address(req.query.q)

        .then( function(location) {
            res.send(location.serialize());

        }).done();
    }

    /**
        Attaches the necessary routes to the `app` passed in, prefixes with the string passed in as `prefix`.

        @arg {string} prefix - This string will be prepended to all of this module's routes. e.g. `'/geocode'`
        @arg {App} app - An instance of an express.js application
    */
    function route_app(prefix, app) {
        app.use(prefix, accept_types(['json']));
        app.get(url_join(prefix, '/coordinates'), from_coordinates);
        app.get(url_join(prefix, '/address'), from_address);
    }

    return {
        route_app: route_app,
        from_coordinates: from_coordinates,
        from_address: from_address,
    };
};
