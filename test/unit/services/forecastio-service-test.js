var setup_dependencies = require('../../setup-dependencies');
var sinon = require('sinon');
var chai_as_promised = require('chai-as-promised');
var chai = require('chai').use(chai_as_promised);
var expect = chai.expect;

var moment = require('moment');
var Q = require('q');

// jshint expr:true

describe('The forecastio service', function() {

    var dependencies;
    var forecastio_service;
    var config_forecastio_mock;
    var request_mock;
    var WeatherModel_mock;
    var ErrorResponse;
    var request_generate_error;

    beforeEach( function() {

        request_generate_error = false;

        dependencies = setup_dependencies();

        dependencies.declare({
            config_forecastio_mock: {
                module: function() {
                    return {
                        url: 'url',
                        api_key: '123',
                        units: 'units',
                    };
                },
            },
            request_mock: {
                module: function() {
                    return sinon.spy( function(options) {
                        return Q.promise( function(resolve, reject) {

                            if (request_generate_error) {
                                reject();

                            } else {
                                resolve({
                                    results: [ 'result' ],
                                });
                            }
                        });
                    });
                },
            },
            WeatherModel_mock: {
                module: function() {
                    return function(location) {
                        this.createdWith = location;
                    };
                },
            },
            geocode_service_mock: {
                module: function() {
                    return {
                        get_from_address: sinon.spy( function() {
                            return Q({
                                get_coordinates: function() {
                                    return {
                                        longitude: 12.3,
                                        latitude: 45.6,
                                    };
                                },
                            });
                        }),
                    };
                },
            },
        });

        dependencies.mock('forecastio_service', [
            'config_forecastio_mock',
            'url_join',
            'request_mock',
            'geocode_service_mock',
            'WeatherModel_mock',
            'ErrorResponse',
        ]);

        forecastio_service = dependencies.inject('forecastio_service');
        config_forecastio_mock = dependencies.inject('config_forecastio_mock');
        WeatherModel_mock = dependencies.inject('WeatherModel_mock');
        request_mock = dependencies.inject('request_mock');
        ErrorResponse = dependencies.inject('ErrorResponse');
    });

    it('can get the forecast for an address correctly', function() {

        return forecastio_service.get_forecast('123 Fake St').then( function(location) {

            expect( request_mock.firstCall.args[0].uri ).to.equal('url/123/45.6,12.3');
            expect( request_mock.firstCall.args[0].qs.units ).to.equal('units');
            expect( request_mock.firstCall.args[0].json ).to.be.true;
            expect( location.createdWith ).to.deep.equal({
                results: [ 'result' ],
            });
        });
    });

    it('can geocode coordinates correctly', function() {

        var now = moment(123456789, 'X');

        return forecastio_service.get_forecast('123 Fake St', now).then( function(location) {

            expect( request_mock.firstCall.args[0].uri ).to.equal('url/123/45.6,12.3,123456789');
            expect( request_mock.firstCall.args[0].qs.units ).to.equal('units');
            expect( request_mock.firstCall.args[0].json ).to.be.true;
            expect( location.createdWith ).to.deep.equal({
                results: [ 'result' ],
            });
        });
    });

    it('fails gracefully when the request fails', function() {

        request_generate_error = true;

        return expect( forecastio_service.get_forecast('123 Fake St') ).to.be.rejectedWith(
            ErrorResponse, 'The forecasting service is unavailable'
        );
    });
});
