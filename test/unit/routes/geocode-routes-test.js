var setup_dependencies = require('../../setup-dependencies');
var sinon = require('sinon');
var expect = require('chai').expect;

var Q = require('q');

// jshint expr:true

describe('The geocode routes', function() {

    var dependencies;
    var geocode_routes;
    var geocode_service_mock;
    var accept_types_mock;
    var req_coordinates;
    var req_address;
    var res;

    beforeEach( function() {

        dependencies = setup_dependencies();

        dependencies.declare({
            geocode_service_mock: {
                module: function() {
                    return {
                        get_from_coordinates: sinon.spy( function() {
                            return Q({
                                serialize: sinon.stub().returns('coordinates_serialized'),
                            });
                        }),
                        get_from_address: sinon.spy( function() {
                            return Q({
                                serialize: sinon.stub().returns('address_serialized'),
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
        });

        dependencies.mock('geocode_routes', [
            'geocode_service_mock',
            'accept_types_mock',
            'ErrorResponse',
            'url_join',
        ]);

        geocode_routes = dependencies.inject('geocode_routes');
        geocode_service_mock = dependencies.inject('geocode_service_mock');
        accept_types_mock = dependencies.inject('accept_types_mock');

        req_coordinates = {
            accept_type: 'json',
            query: {
                longitude: 12.3,
                latitude: 45.6,
            },
        };

        req_address = {
            accept_type: 'json',
            query: {
                q: '123 Fake St',
            },
        };

        res = {
            send: sinon.spy(),
            render: sinon.spy(),
        };
    });

    it('can geocode an address', function() {

        geocode_routes.from_address(req_address, res);

        expect( geocode_service_mock.get_from_address.calledWith('123 Fake St') ).to.be.true;
        return geocode_service_mock.get_from_address.firstCall.returnValue.then( function() {
            expect( res.send.calledWith('address_serialized') ).to.be.true;
        });
    });

    it('can geocode a set of coordinates', function() {

        geocode_routes.from_coordinates(req_coordinates, res);

        expect( geocode_service_mock.get_from_coordinates.calledWith(45.6, 12.3) ).to.be.true;

        return geocode_service_mock.get_from_coordinates.firstCall.returnValue.then( function() {
            expect( res.send.calledWith('coordinates_serialized') ).to.be.true;
        });
    });

    it('sets up routes correctly', function() {

        var app = {
            use: sinon.spy(),
            get: sinon.spy(),
        };

        geocode_routes.route_app('/prefix', app);

        expect( accept_types_mock.calledWith(['json']) ).to.be.true;
        expect( app.use.calledWith('/prefix', 'accept_types') ).to.be.true;
        expect( app.get.calledWith('/prefix/coordinates'), geocode_routes.from_coordinates ).to.be.true;
        expect( app.get.calledWith('/prefix/address'), geocode_routes.from_address ).to.be.true;
    });

    afterEach( function() {
        dependencies.unmock('geocode_routes');
    });
});
