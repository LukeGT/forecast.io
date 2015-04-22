var setup_dependencies = require('../../setup-dependencies');
var expect = require('chai').expect;

// jshint expr:true

describe('The weather model', function() {

    var dependencies;
    var ErrorResponse;

    beforeEach( function() {

        dependencies = setup_dependencies();
        ErrorResponse = dependencies.inject('ErrorResponse');
    });

    it('sets its properties appropriately', function() {
        expect( new ErrorResponse(123, '456') ).to.deep.equal({
            status: 123,
            message: '456',
        });
    });

    it('inherits Error', function() {
        expect( new ErrorResponse() ).to.be.an.instanceof(Error);
    });
});
