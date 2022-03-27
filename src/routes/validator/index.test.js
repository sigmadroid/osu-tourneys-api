// Unit under test
const validator = require('./index');

describe('validator', () => {
    describe('.validateSchema()', () => {
        let schema;
        let data;

        beforeEach(() => {
            schema = {
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    }
                }
            };
            data = {
                name: 'john doe'
            };
        });

        describe('when data does not pass validation', () => {
            test('should return an array of errors', () => {
                data.name = 10;
                const validationErrors = validator.validateSchema(schema, data);
                expect(validationErrors).toEqual(['/name must be string']);
            });
        });

        describe('when data passes validation', () => {
            test('should return an empty array', () => {
                const validationErrors = validator.validateSchema(schema, data);
                expect(validationErrors).toEqual([]);
            });
        });
    });
});