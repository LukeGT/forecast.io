var setup_dependencies = require('../../setup-dependencies');
var sinon = require('sinon');
var expect = require('chai').expect;

var Q = require('q');

// jshint expr:true

describe('The forecastio routes', function() {

    var dependencies;
    var forecastio_routes;
    var forecastio_service_mock;
    var accept_types_mock;
    var date_utils_mock;
    var req;
    var res;

    beforeEach( function() {

        dependencies = setup_dependencies();

        dependencies.declare({
            config_forecastio_mock: {
                module: function() {
                    return {
                        valid_weekdays: [ 'monday' ],
                    };
                },
            },
            forecastio_service_mock: {
                module: function() {
                    return {
                        get_forecast: sinon.spy( function() {
                            return Q({
                                serialize: sinon.stub().returns('serialized_weather'),
                                get_daily_weather: sinon.stub().returns([ 'daily_weather' ]),
                                get_hourly_weather: sinon.stub().returns([ 'hourly_weather' ]),
                            });
                        }),
                    };
                },
            },
            accept_types_mock: {
                module: function() {
                    return sinon.stub().returns('accept_types');
                },
            },
            date_utils_mock: {
                module: function(date_utils) {

                    var today = date_utils.get_today();
                    var weekday = date_utils.get_weekday('monday');

                    return {
                        get_today: sinon.stub().returns(today),
                        get_weekday: sinon.stub().returns(weekday),
                    };
                },
                dependencies: [ 'date_utils' ],
            },
        });

        dependencies.mock('forecastio_routes', [
            'config_forecastio_mock',
            'forecastio_service_mock',
            'accept_types_mock',
            'ErrorResponse',
            'url_join',
            'lodash',
            'date_utils_mock',
        ]);

        forecastio_routes = dependencies.inject('forecastio_routes');
        forecastio_service_mock = dependencies.inject('forecastio_service_mock');
        accept_types_mock = dependencies.inject('accept_types_mock');
        date_utils_mock = dependencies.inject('date_utils_mock');

        req = {
            accept_type: 'json',
            params: {
                address: '123 Fake St',
                weekday: 'monday',
            },
        };

        res = {
            send: sinon.spy(),
            render: sinon.spy(),
        };
    });

    it('can send weather for an address', function() {

        forecastio_routes.at_address(req, res);

        expect( forecastio_service_mock.get_forecast.calledWith('123 Fake St') ).to.be.true;
        return forecastio_service_mock.get_forecast.firstCall.returnValue.then( function() {
            expect( res.send.calledWith('serialized_weather') ).to.be.true;
        });
    });

    it('can send weather for an address today', function() {

        forecastio_routes.at_address_today(req, res);

        expect(
            forecastio_service_mock.get_forecast.calledWith('123 Fake St', date_utils_mock.get_today())
        ).to.be.true;

        return forecastio_service_mock.get_forecast.firstCall.returnValue.then( function() {
            expect( res.send.calledWith('serialized_weather') ).to.be.true;
        });
    });

    it('can send weather for an address on a weekday', function() {

        forecastio_routes.at_address_weekday(req, res);

        expect(
            forecastio_service_mock.get_forecast.calledWith('123 Fake St', date_utils_mock.get_weekday())
        ).to.be.true;

        return forecastio_service_mock.get_forecast.firstCall.returnValue.then( function() {
            expect( res.send.calledWith('serialized_weather') ).to.be.true;
        });
    });

    it('can send weather in html form for a single day', function() {

        req.accept_type = 'html';

        forecastio_routes.at_address_today(req, res);

        return forecastio_service_mock.get_forecast.firstCall.returnValue.then( function() {

            expect( res.render.calledWith('single', {
                location: '123 Fake St',
                weather_summary: 'daily_weather',
                hourly_weather: [ 'hourly_weather' ],
            }) ).to.be.true;

        });
    });

    it('can send weather in html form for multiple days', function() {

        req.accept_type = 'html';

        forecastio_routes.at_address(req, res);

        return forecastio_service_mock.get_forecast.firstCall.returnValue.then( function() {

            expect( res.render.calledWith('multi', {
                location: '123 Fake St',
                daily_weather: [ 'daily_weather' ],
            }) ).to.be.true;
        });
    });

    it('sets up routes correctly', function() {

        var app = {
            use: sinon.spy(),
            get: sinon.spy(),
        };

        forecastio_routes.route_app('/prefix', app);

        expect( accept_types_mock.calledWith(['html', 'json']) ).to.be.true;
        expect( app.use.calledWith('/prefix', 'accept_types') ).to.be.true;
        expect( app.get.calledWith('/prefix/:address'), forecastio_routes.at_address ).to.be.true;
        expect( app.get.calledWith('/prefix/:address/today'), forecastio_routes.at_address_today ).to.be.true;
        expect( app.get.calledWith('/prefix/:address/:weekday'), forecastio_routes.at_address_weekday ).to.be.true;
    });

    afterEach( function() {
        dependencies.unmock('forecastio_routes');
    });
});
