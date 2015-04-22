var setup_dependencies = require('../../setup-dependencies');
var expect = require('chai').expect;

// jshint expr:true

describe('The location model', function() {

    var dependencies;
    var LocationModel;
    var location;

    beforeEach( function() {

        dependencies = setup_dependencies();

        dependencies.declare({
            config_geocode_mock: {
                module: function() {
                    return {
                        irrelevant_address_components: [ 'a', 'b', 'c' ],
                    };
                },
            },
        });

        dependencies.mock('LocationModel', [ 'config_geocode_mock', 'lodash' ]);

        location = {
            address_components: [
                {
                    long_name: 'bad',
                    types: [ 'b', 'a', 'd' ],
                }, {
                    long_name: 'good',
                    types: [ 'g', 'o', 'o', 'd' ],
                }, {
                    long_name: 'okay',
                    types: [ 'o', 'k', 'a', 'y' ],
                }, {
                    long_name: 'medium',
                    types: [ 'm', 'e', 'd', 'i', 'u', 'm' ],
                },
            ],
            geometry: {
                location: {
                    lat: 123,
                    lng: 456,
                },
            },
        };

        LocationModel = dependencies.inject('LocationModel');
    });

    it('filters out irrelevant address components', function() {

        var location_model = new LocationModel(location);

        expect( location_model.get_city() ).to.equal('good medium');
    });

    it('retrieves the longitude and latitude from the location object', function() {

        var location_model = new LocationModel(location);

        expect( location_model.get_coordinates() ).to.deep.equal({
            latitude: 123,
            longitude: 456,
        });
    });

    it('returns a correct serialisation', function() {

        var location_model = new LocationModel(location);

        expect( location_model.serialize() ).to.deep.equal({
            address: 'good medium',
            coordinates: {
                latitude: 123,
                longitude: 456,
            },
        });
    });

    afterEach( function() {
        dependencies.unmock('LocationModel');
    });
});
