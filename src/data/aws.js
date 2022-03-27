const AWS = require('aws-sdk');

const fn = {
    getSecret,
    getSecretsManagerClient
};

module.exports = fn;

let secretsClient;

/**
 * Initialize or return existing instance of AWS Secrets Manager client
 * @returns {Object} an instance of AWS Secrets Manager client
 */
function getSecretsManagerClient() {
    if (!secretsClient) {
        secretsClient = new AWS.SecretsManager({
            region: 'us-west-2'
        });
    }

    return secretsClient;
}

/**
 * Get a value stored in AWS Secrets Manager using value key
 * @param {string} name key of the stored value
 * @returns {Promise<string>} the value retrieved
 */
function getSecret(name) {
    return new Promise((resolve, reject) => {
        fn.getSecretsManagerClient().getSecretValue({ SecretId: name}, (err, data) => {
            if (err) {
                reject(err);
            }
            // Decrypts secret using the associated KMS CMK.
            // Depending on whether the secret is a string or binary, one of these fields will be populated.
            if ('SecretString' in data) {
                resolve(data.SecretString);
            } else {
                const buff = Buffer.from(data.SecretBinary, 'base64');
                resolve(buff.toString('ascii'));
            }
        });
    });
}
