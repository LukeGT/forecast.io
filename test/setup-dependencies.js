
var dependencies = require('../lib/dependencies');
var app_dependencies = require('../app-dependencies');

module.exports = function() {
    dependencies.clear();
    dependencies.declare(app_dependencies);
    return dependencies;
};
