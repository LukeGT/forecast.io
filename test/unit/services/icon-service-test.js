var setup_dependencies = require('../../setup-dependencies');
var expect = require('chai').expect;
var _ = require('lodash');

// jshint expr:true

describe('The weather model', function() {

    var dependencies;
    var icon_service;

    beforeEach( function() {

        dependencies = setup_dependencies();

        dependencies.declare({
            config_icons_mock: {
                module: function() {
                    return {
                        summary_icons: {
                            'a': 'A',
                        },
                        wind_speed_icon: 'wind-speed-%d',
                        wind_speed_max: 12,
                        beaufort_constant: 0.836,
                        wind_direction_icon: '%d',
                        wind_direction_num: 24,
                        moon_icon: 'moon-%s',
                        moon_phase_num: 28,
                        moon_perfect_phases: [
                            'a',
                            'b',
                            'c',
                            'd',
                        ],
                        moon_intermediate_phases: [
                            'a-%d',
                            'b-%d',
                            'c-%d',
                            'd-%d',
                        ],
                    };
                },
            },
        });

        dependencies.mock('icon_service', [ 'config_icons_mock' ]);

        icon_service = dependencies.inject('icon_service');
    });

    it('it looks up summary icons correctly', function() {
        expect( icon_service.get_summary('a') ).to.equal('A');
    });

    it('calculates wind speed icons correctly', function() {
        expect( icon_service.get_wind_speed(10) ).to.equal('wind-speed-5');
    });

    it('respects the maximum wind speed', function() {
        expect( icon_service.get_wind_speed(Infinity) ).to.equal('wind-speed-12');
    });

    it('calculates the wind direction correctly', function() {

        _.range(360).forEach( function(bearing) {

            var degrees = +icon_service.get_wind_direction(bearing);
            var diff = degrees - bearing;

            if (diff < -180) {
                diff += 360;
            }

            expect( Math.abs(diff) ).to.be.below(360 / 48);
        });
    });

    it('calculates the moon phases correctly', function() {

        var phases = _.range(28).map( function(phase) {
            return icon_service.get_moon(phase / 28);
        });

        var sorted_phases = _.clone(phases).sort();

        expect( phases ).to.deep.equal(sorted_phases);
    });
});
