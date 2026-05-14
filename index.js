const validate = require('./lib/validate');
const validateProperties = require('./lib/validateProperties');
const validateWhitelistProperties = require('./lib/validateWhitelistProperties');

module.exports = {
  validate,
  validateProperties,
  validateWhitelistProperties,
  ...validate,
  ...validateProperties,
};
