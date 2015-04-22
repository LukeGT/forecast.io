/**

A tiny dependency injection framework. The user declares modules and their dependencies using the `declare` method.
Instantiating modules is done using the `inject` method.

Modules are declared by exporting a function as `module.exports`. This function takes in a number of parameters
corresponding to each of its dependencies. See below for an example. The function should return an instance of the
dependency, which is what other modules will receive within their arguments.

Basic mocking facilities are provided. Note that because modules are cached, `inject_fresh()` should be used for
injected modules with mocked dependencies. The cache is cleared autoamtically for modules with mocked dependencies.

#### kebabify.js

    module.exports = function(_) {
        return function kebabify(string) {
            return _.kebabCase(string);
        }
    }

#### index.js

    var dependencies = require('./dependencies');

    dependencies.declare({
        kebabify: {
            module: require('./kebabify'),
            dependencies: [ 'lodash' ],
        },
        lodash: {
            module: dependencies.require('lodash'),
        },
    });

    var kebabify = dependencies.inject('kebabify');
    console.log(kebabify('Hello World!')); // "hello-world"

    @module
*/

/**
    Contains all of the information necessary for each module. This includes the module itself, a list of its
    dependencies, and an instance of the module (if instantiated).
*/
var requirements = {};

/**
    Declares a new set of modules. Modules can be declared in the following way:

    {
        // A regular module
        module_name: {
            module: require('./my/module'),
            dependencies: [ 'module_name_2', ... ],
        },

        // A node module
        node_module: {
            module: dependencies.require('node_module'),
        },
    }

    @arg {string} declaration - The name of the new module
*/
function declare(declaration) {
    for (var module_name in declaration) {
        requirements[module_name] = declaration[module_name];
    }
}

/**
    Clears all declarations, resetting the state of the library back to what it was upon initial instantiation.
*/
function clear() {
    requirements = {};
}

/**
    A helper function to allow the easy inclusion of node modules
    @function require
    @arg {string} dependency - The dependency to require
    @returns {module} A module compatible with the dependency injection framework
*/
function node_require(dependency) {
    return function() {
        return require(dependency);
    };
}

/**
    Wraps an object in a function so that it can be included as a module
    @arg {*} dependency - The dependency to wrap
    @returns {module} A module compatible with the dependency injection framework
*/
function wrap(dependency) {
    return function() {
        return dependency;
    };
}

/**
    Mock out a given module's dependencies
    @arg {string} module_name - The name of the module to mock
    @arg {string[]} dependencies - The module's new dependencies
*/
function mock(module_name, dependencies) {

    var requirement = requirements[module_name];

    if (!requirement) {
        throw new Error('Module "' + module_name + '" does not exist.');
    }

    dependencies.previous = requirement.dependencies;
    requirement.dependencies = dependencies;

    delete requirement.instance;
}

/**
    Reverts the dependencies of a module to their previous state before being mocked.
    @arg {string} module_name - The name of the module to unmock
*/
function unmock(module_name) {

    var requirement = requirements[module_name];

    if (!requirement) {
        throw new Error('Module "' + module_name + '" does not exist.');
    }

    var previous = requirement.dependencies.previous;

    if (!previous) {
        throw new Error('Module "' + module_name + '" was never mocked.');
    }

    requirement.dependencies = previous;
    delete requirement.instance;
}

/**
    Returns a module, with dependencies resolved and injected.
    @arg {string} module_name - The name of the module to inject
    @returns {*} An instance of the module
*/
function inject(module_name) {

    var requirement = requirements[module_name];

    if (!requirement) {
        throw new Error('Module "' + module_name + '" does not exist.');
    }

    if (requirement.instance === null) {
        throw new Error('Module "' + module_name + '" has a circular dependency');
    }

    // Only instantiate the module if we haven't already
    if (!requirement.instance) {

        requirement.instance = null; // Mark that we are currently injecting this module
        var resolved_dependencies;

        // Resolve all necessary dependencies
        if (requirement.dependencies) {
            resolved_dependencies = requirement.dependencies.map( function(dependency) {
                return inject(dependency);
            });
        } else {
            resolved_dependencies = [];
        }

        // Inject the requirements and instantiate the module
        requirement.instance = requirement.module.apply(null, resolved_dependencies);
    }

    return requirement.instance;
}

module.exports = {
    clear: clear,
    declare: declare,
    inject: inject,
    mock: mock,
    require: node_require,
    unmock: unmock,
    wrap: wrap,
};
