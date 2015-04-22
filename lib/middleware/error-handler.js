/**
    A middleware function which converts exceptions into responses which the client can accept. If the exception is of
    type {@link ErrorResponse}, then the status and message of the exception are sent to the client. Otherwise the error
    is masked.
    @module
*/
module.exports = function(ErrorResponse) {

    return function error_handler(err, req, res, next) {

        console.error('An error occurred: ', err, err.stack);

        // Mask unintentional errors
        if (!(err instanceof ErrorResponse)) {
            err = new ErrorResponse(500, 'An unexpected error occurred');
        }

        res.status(err.status);

        if (req.accept_type === 'json') {
            res.send({
                error: err.message,
            });

        } else if (req.accept_type === 'html') {
            res.render('error', err);

        } else {
            res.end();
        }
    };
};
