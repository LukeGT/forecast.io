var supertest = require('supertest');
var setup_dependencies = require('../setup-dependencies');
var sinon = require('sinon');

describe('retrieving a forecast', function() {

    var dependencies;
    var app;
    var test;
    var clock;

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
    });

    it('retrieves the forecast for an address', function(done) {

        test
        .get('/weather/Sydney%20NSW')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect( JSON.stringify(require('./responses/forecast-address')), done );
    });

    it('retrieves the forecast for an address today', function(done) {

        test
        .get('/weather/Sydney%20NSW/today')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect( JSON.stringify(require('./responses/forecast-address-today')), done );
    });

    it('retrieves the forecast for an address on a weekday', function(done) {

        test
        .get('/weather/Sydney%20NSW/monday')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect( JSON.stringify(require('./responses/forecast-address-monday')), done );
    });

    afterEach( function() {
        clock.restore();
    });
});
