// Required to test
const sinon = require('sinon');

// Unit under test
const awsData = require('./aws');

describe('aws data', () => {
    describe('.getSecret()', () => {
        beforeEach(() => {
            sinon.stub(awsData, 'getSecretsManagerClient');
        });

        afterEach(sinon.restore);

        describe('when getting secret throws an error', () => {
            test('should throw an error', () => {
                // AWS.mock('SecretsManager', 'getSecretValue', (params, callback) => callback('ERROR'));
                awsData.getSecretsManagerClient.returns({
                    getSecretValue: (params, callback) => callback(new Error('BOOM!'))
                });

                return awsData.getSecret('secret-value')
                    .then(() => {
                        throw new Error('should have throw an error');
                    })
                    .catch(error => {
                        expect(error).toEqual(new Error('BOOM!'));
                    });
            });
        });

        describe('when secret is a string', () => {
            test('should return the secret', async() => {
                awsData.getSecretsManagerClient.returns({
                    getSecretValue: (params, callback) => callback(null, { SecretString: 'my-secret' })
                });

                const result = await awsData.getSecret('secret-value');
                expect(result).toBe('my-secret');
            });
        });

        describe('when secret is binary', () => {
            test('should return the secret', async() => {
                awsData.getSecretsManagerClient.returns({
                    getSecretValue: (params, callback) => callback(null, { SecretBinary: 'bXktc2VjcmV0' })
                });

                const result = await awsData.getSecret('secret-value');
                expect(result).toBe('my-secret');
            });
        });
    });

    describe('.getSecretsManagerClient()', () => {
        describe('when client has not been created', () => {
            test('should create a new client and return it', () => {
                // TODO: how to test constructor called?
            });
        });

        describe('when client already exists', () => {
            it('should not create a new client', () => {
                // TODO: how to test constructor not called?
            });
        });
    });
});
