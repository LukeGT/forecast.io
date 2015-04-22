var setup_dependencies = require('../../setup-dependencies');
var expect = require('chai').expect;
var moment = require('moment');

// jshint expr:true

describe('The date utilities', function() {

    var dependencies;
    var date_utils;

    beforeEach( function() {

        dependencies = setup_dependencies();
        date_utils = dependencies.inject('date_utils');
    });

    it('always returns a date in the future when asking for a weekday', function() {
        [ 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday' ].forEach( function(weekday) {
            expect( date_utils.get_weekday(weekday) - moment() ).to.be.above(0);
        });
    });
});
