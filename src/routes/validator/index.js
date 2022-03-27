const Ajv = require('ajv');

const ajv = new Ajv({
    allErrors: true
});

/**
 * Validate an object with an schema using AJV rule definitions
 * @param {Object} schema the schema with the rules to validate
 * @param {Object} data the object to validate
 * @returns {string[]} a list of error messages or undefined if none
 */
function validateSchema(schema, data) {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
        return validate.errors.map(({ instancePath, message }) => `${instancePath} ${message}`);
    }
    return [];
}

module.exports = {
    validateSchema
};
