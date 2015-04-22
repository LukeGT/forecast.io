/**
    A middleware function that wraps all requests in a 'domain', an experimental feature of node which allows for
    exceptions to be caught more reliably.
    @module
*/

module.exports = function(domain) {

    return function domain_wrapper(req, res, next) {

        var requestDomain = domain.create();

        requestDomain.add(req);
        requestDomain.add(res);
        requestDomain.on('error', next);

        requestDomain.run(next);
    };
};
