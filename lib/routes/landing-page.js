/**
    Provides routes that render the landing HTML page.
    @module
*/
module.exports = function(accept_types) {

    /**
        Render the `index` template
    */
    function index(req, res) {
        res.render('index');
    }

    /**
        Attaches the necessary routes to the `app` passed in, prefixes with the string passed in as `prefix`.

        @arg {string} prefix - This string will be prepended to all of this module's routes. e.g. `'/index'`
        @arg {App} app - An instance of an express.js application
    */
    function route_app(prefix, app) {
        app.use(prefix, accept_types(['html']));
        app.get(prefix, index);
    }

    return {
        route_app: route_app,
        index: index,
    };
};
