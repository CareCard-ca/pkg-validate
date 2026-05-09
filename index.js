const validate = require('./lib/validate');
const validateProperties = require('./lib/validateProperties');

module.exports = {
  validate,
  validateProperties,
  ...validate,
  ...validateProperties,
};
