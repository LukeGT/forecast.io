var setup_dependencies = require('../../setup-dependencies');
var sinon = require('sinon');
var chai_as_promised = require('chai-as-promised');
var chai = require('chai').use(chai_as_promised);
var expect = chai.expect;

var Q = require('q');

// jshint expr:true

describe('The geocode service', function() {

    var dependencies;
    var geocode_service;
    var config_geocode_mock;
    var request_mock;
    var LocationModel_mock;
    var ErrorResponse;
    var request_generate_error;

    beforeEach( function() {

        request_generate_error = false;

        dependencies = setup_dependencies();

        dependencies.declare({
            config_geocode_mock: {
                module: function() {
                    return {
                        url: 'url',
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
            LocationModel_mock: {
                module: function() {
                    return function(location) {
                        this.createdWith = location;
                    };
                },
            },
        });

        dependencies.mock('geocode_service', [
            'config_geocode_mock',
            'request_mock',
            'LocationModel_mock',
            'ErrorResponse',
        ]);

        geocode_service = dependencies.inject('geocode_service');
        config_geocode_mock = dependencies.inject('config_geocode_mock');
        LocationModel_mock = dependencies.inject('LocationModel_mock');
        request_mock = dependencies.inject('request_mock');
        ErrorResponse = dependencies.inject('ErrorResponse');
    });

    it('can geocode an address correctly', function() {

        return geocode_service.get_from_address('123 Fake St').then( function(location) {

            expect( request_mock.firstCall.args[0].uri ).to.equal(config_geocode_mock.url);
            expect( request_mock.firstCall.args[0].json ).to.be.true;
            expect( request_mock.firstCall.args[0].qs.address ).to.equal('123 Fake St');
            expect( location.createdWith ).to.equal('result');
        });
    });

    it('can geocode coordinates correctly', function() {

        return geocode_service.get_from_coordinates(12.3, 45.6).then( function(location) {

            expect( request_mock.firstCall.args[0].uri ).to.equal(config_geocode_mock.url);
            expect( request_mock.firstCall.args[0].json ).to.be.true;
            expect( request_mock.firstCall.args[0].qs.latlng ).to.equal('12.3,45.6');
            expect( location.createdWith ).to.equal('result');
        });
    });

    it('fails gracefully when the request fails', function() {

        request_generate_error = true;

        return expect( geocode_service.get_from_coordinates(12.3, 45.6) ).to.be.rejectedWith(
            ErrorResponse, 'Geocoding service is unavailable'
        );
    });
});
