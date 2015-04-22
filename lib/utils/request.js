/**
    @module
*/

module.exports = function(Q, request) {

    /**
        Acts just like the well-known request() library's method, except that it does not take a callback function,
        and returns a promise which resolves to the body of the response. If an error occurs, or the status code is
        400 or above, the promise is rejected.
        @arg {...arguments} arguments - A list of arguments to pass through to request
    */
    function request_promise(/* arguments */) {

        // We must copy the special arguments variable in order to later manipulate it
        var args = Array.prototype.slice.call(arguments);

        return Q.promise( function(resolve, reject) {

            request.apply(null, args.concat( function(error, response, body) {

                if (error || response.statusCode >= 400) {
                    reject([error, response, body]);

                } else {
                    resolve(body);
                }
            }));
        });
    }

    return request_promise;
};
