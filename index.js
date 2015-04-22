var dependencies = require('./lib/dependencies');
var app_dependencies = require('./app-dependencies');

// Set everything in motion
dependencies.declare(app_dependencies);
dependencies.inject('server');
