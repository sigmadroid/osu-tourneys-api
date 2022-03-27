// Required to test
const sinon = require('sinon');

// Unit under test
const errorHandler = require('./errorHandler');

describe('ErrorHandler', () => {
    describe('.errorHandler()', () => {
        let error;
        let res;

        beforeEach(() => {
            error = {
                expose: true,
                status: 400,
                message: 'BOOM!'
            };
            res = {};
            res.status = sinon.stub().returns(res);
            res.send = sinon.spy();
        });

        describe('when exposing error to client', () => {
            test('should use custom status code if defined', () => {
                errorHandler(error, null, res, null);
                expect(res.status.getCall(0).args[0]).toBe(400);
            });

            test('should respond with error message', () => {
                errorHandler(error, null, res, null);
                expect(res.send.getCall(0).args[0]).toEqual(error);
            });
        });

        describe('when not exposing error to client', () => {
            test('should respond with internal server error message', () => {
                error.expose = false;
                errorHandler(error, null, res, null);
                expect(res.status.getCall(0).args[0]).toBe(500);
            });
        });
    });
});
