const validate = require('./lib/validate');
const { validatePassword, ...legacyValidate } = validate;
const validateProperties = require('./lib/validateProperties');
const validateWhitelistProperties = require('./lib/validateWhitelistProperties');
const validateNewUserRoleRequest = require('./lib/validateNewUserRoleRequest');

module.exports = {
  validate: legacyValidate,
  validatePassword,
  validateProperties,
  validateWhitelistProperties,
  ...validateNewUserRoleRequest,
  ...legacyValidate,
  ...validateProperties,
};
