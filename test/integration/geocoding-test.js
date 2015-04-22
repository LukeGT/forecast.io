var supertest = require('supertest');
var setup_dependencies = require('../setup-dependencies');
var sinon = require('sinon');

describe('retrieving a geocode', function() {

    var dependencies;
    var app;
    var test;
    var clock;
    var expected_response;

    beforeEach( function() {

        dependencies = setup_dependencies();

        dependencies.declare({
            request: {
                module: require('./mocked-request'),
            },
        });

        app = dependencies.inject('server');
        app.server.close(); // We don't need this running during tests

        test = supertest(app);

        clock = sinon.useFakeTimers(1429688565000);

        expected_response = JSON.stringify({
            address: 'Sydney New South Wales Australia',
            coordinates: {
                latitude: -33.8674869,
                longitude: 151.2069902,
            },
        });
    });

    it('retrieves the geocode for an address', function(done) {

        test
        .get('/geocode/address?q=Sydney%20NSW')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(expected_response, done);
    });

    it('retrieves the geocode by coordinates', function(done) {

        test
        .get('/geocode/coordinates?latitude=-33.8674869&longitude=151.2069902')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(expected_response, done);
    });

    afterEach( function() {
        clock.restore();
    });
});
