/**
    @module
*/
module.exports = function() {

    /**
        Raises an Error, except that when it is caught by the error handling middleware,
        a useful message is sent to the user instead of a blank 500.
        @constructor
        @arg {Number} status - The status of the error response
        @arg {string} message - The message to show the user
    */
    function ErrorResponse(status, message) {
        this.status = status;
        this.message = message;
    }

    ErrorResponse.prototype = new Error();

    return ErrorResponse;
};
