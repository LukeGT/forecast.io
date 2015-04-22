var expect = require('chai').expect;

var dependencies = require('../../lib/dependencies');

// jshint expr:true

describe('The dependencies library', function() {

    beforeEach( function() {
        dependencies.clear();
    });

    it('supports node libraries', function() {

        dependencies.declare({
            moment: {
                module: dependencies.require('moment'),
            },
        });

        expect( dependencies.inject('moment') === require('moment') ).to.be.true;
    });

    it('can clear dependencies', function() {

        dependencies.declare({
            moment: {
                module: dependencies.require('moment'),
            },
        });

        dependencies.clear();

        expect( function() {
            dependencies.inject('moment');
        }).to.throw(Error, 'Module "moment" does not exist');
    });

    it('injects a chain of dependencies', function() {

        dependencies.declare({
            a: {
                module: function() { return 'a'; },
            },
            b: {
                module: function(a) { return a + 'b'; },
                dependencies: [ 'a' ],
            },
            c: {
                module: function(a, b) { return a + b + 'c'; },
                dependencies: [ 'a', 'b' ],
            },
        });

        expect( dependencies.inject('c') ).to.equal('aabc');
    });

    it('instantiates only a single instance of dependencies', function() {

        dependencies.declare({
            a: {
                module: function() { return 'a'; },
            },
            b: {
                module: function(a1, a2) {
                    return {
                        a1: a1,
                        a2: a2,
                    };
                },
                dependencies: [ 'a', 'a' ],
            },
        });

        var instance = dependencies.inject('b');

        expect( instance.a1 ).to.equal( instance.a2 );
    });

    it('can detect circular dependencies', function() {

        dependencies.declare({
            good: {
                module: function(a) { return 'good'; },
                dependencies: [ 'a' ],
            },
            a: {
                module: function(b) { return 'a'; },
                dependencies: [ 'b' ],
            },
            b: {
                module: function(a) { return 'b'; },
                dependencies: [ 'a' ],
            },
        });

        expect( function() {
            dependencies.inject('good');
        }).to.throw(Error, 'Module "a" has a circular dependency');
    });

    it('allows a module\'s dependencies to be mocked and unmocked again', function() {

        dependencies.declare({
            a: {
                module: function() {
                    return {
                        value: 'a',
                    };
                },
            },
            b: {
                module: function(a) {
                    return {
                        value: a.value + 'b',
                    };
                },
                dependencies: [ 'a' ],
            },
            c: {
                module: function(a) {
                    return {
                        value: a.value + 'c',
                    };
                },
                dependencies: [ 'a' ],
            },
        });

        var real_b = dependencies.inject('b');
        dependencies.mock('b', [ 'c' ]);
        var mocked_b = dependencies.inject('b');

        expect( real_b ).to.not.equal( mocked_b );
        expect( real_b.value ).to.equal('ab');
        expect( mocked_b.value ).to.equal('acb');

        dependencies.unmock('b');
        var another_real_b = dependencies.inject('b');

        expect( another_real_b ).to.not.equal( real_b );
        expect( another_real_b ).to.not.equal( mocked_b );
        expect( another_real_b.value ).to.equal( real_b.value );
    });
});
