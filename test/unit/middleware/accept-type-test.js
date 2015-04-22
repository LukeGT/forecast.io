var setup_dependencies = require('../../setup-dependencies');
var sinon = require('sinon');
var expect = require('chai').expect;

// jshint expr:true

describe('The accept-type middleware', function() {

    var dependencies;
    var accept_types;
    var ErrorResponse;
    var req;
    var next;

    beforeEach( function() {
        dependencies = setup_dependencies();
        accept_types = dependencies.inject('accept_types');
        ErrorResponse = dependencies.inject('ErrorResponse');
        req = {};
        next = sinon.spy();
    });

    it('works in the basic case', function() {

        var middleware = accept_types(['json', 'html']);
        req.accepts = function(type) {
            return type === 'html';
        };

        middleware(req, null, next);

        expect(req.accept_type).to.equal('html');
        expect(next.called).to.be.true;
    });

    it('incorporates precedence', function() {

        var middleware = accept_types(['json', 'html']);
        req.accepts = function(type) {
            return type === 'json' || type === 'html';
        };

        middleware(req, null, next);

        expect(req.accept_type).to.equal('json');
        expect(next.called).to.be.true;
    });

    it('throws an ErrorResponse if no types are acceptable', function() {

        var middleware = accept_types(['json', 'html']);
        req.accepts = function(type) {
            return type === 'xml';
        };

        expect( function() {
            middleware(req, null, next);
        }).to.throw(ErrorResponse);
        expect(next.called).to.be.false;
    });
});
