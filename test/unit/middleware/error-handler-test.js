var setup_dependencies = require('../../setup-dependencies');
var sinon = require('sinon');
var expect = require('chai').expect;

// jshint expr:true

describe('The accept-type middleware', function() {

    var dependencies;
    var error_handler;
    var ErrorResponse;
    var err;
    var req;
    var res;
    var next;

    beforeEach( function() {
        dependencies = setup_dependencies();
        error_handler = dependencies.inject('error_handler');
        ErrorResponse = dependencies.inject('ErrorResponse');
        err = new ErrorResponse(123, 'message');
        req = {};
        res = {
            status: sinon.spy(),
            send: sinon.spy(),
            end: sinon.spy(),
            render: sinon.spy(),
        };
        next = sinon.spy();
    });

    it('logs to console.error', function() {

        sinon.spy(console, 'error');

        error_handler(err, req, res, next);

        expect(console.error.called).to.be.true;
        expect(next.called).to.be.false;
    });

    it('sets the status appropriately', function() {

        error_handler(err, req, res, next);

        expect(res.status.calledWith(123)).to.be.true;
        expect(next.called).to.be.false;
    });

    it('sends correct JSON if the client accepts json', function() {

        req.accept_type = 'json';

        error_handler(err, req, res, next);

        expect(res.send.calledWith({
            error: 'message',
        })).to.be.true;
    });

    it('renders the error page if the client accepts html', function() {

        req.accept_type = 'html';

        error_handler(err, req, res, next);

        expect(res.render.calledWith('error', err)).to.be.true;
    });

    it('ends the request if the client accepts neither json nor html', function() {

        req.accept_type = 'xml';

        error_handler(err, req, res, next);

        expect(res.end.called).to.be.true;
    });

    it('masks unexpected errors', function() {

        req.accept_type = 'json';
        err = new Error('unexpected');

        error_handler(err, req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.send.calledWith({
            error: 'An unexpected error occurred',
        })).to.be.true;
    });
});
