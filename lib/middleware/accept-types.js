/**
    @module
*/

module.exports = function(_, ErrorResponse) {

    /**
        Generate a middleware method that will read in the accepts header in the given priority order, and set an
        "accept_type" parameter on the request object. If none of the given types are acceptable, a 400 error will
        be returned.
        @arg {string} types - A priority ordered array of valid acceptance types
    */
    function accept_types(types) {

        return function accept_type_middleware(req, res, next) {

            var valid_type = _.find(types, function(type) {
                return req.accepts(type);
            });

            if (valid_type) {
                req.accept_type = valid_type;
                next();

            } else {
                throw new ErrorResponse(400, 'Invalid "Accept" header. Supported types: ' + types.join(', '));
            }
        };
    }

    return accept_types;
};
