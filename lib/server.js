module.exports = function(
    config,
    express, sass_middleware, bourbon,
    landing_page, geocode, forecastio, domain_wrapper, error_handler
) {

    var app = express();

    // Server configuration

    app.set('view engine', 'jade');

    // Middleware

    app.use(domain_wrapper);
    app.use(sass_middleware({
        src: config.styles_directory,
        dest: config.styles_directory,
        outputStyle: 'compressed',
        prefix: config.static_prefix,
        includePaths: bourbon.includePaths,
    }));
    app.use(config.static_prefix, express.static(config.styles_directory));
    app.use(config.static_prefix, express.static(config.scripts_directory));

    // Routes

    app.get('/', function(req, res) {
        res.redirect('/app');
    });

    landing_page.route_app('/app', app);
    geocode.route_app('/geocode', app);
    forecastio.route_app('/weather', app);

    app.use(error_handler);

    // Start the server

    app.server = app.listen(config.port, config.hostname, function() {
        var address = app.server.address();
        console.log('Listening on http://%s:%s', address.address, address.port);
    });

    return app;
};
