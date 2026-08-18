const validate = require('./lib/validate');
const validateProperties = require('./lib/validateProperties');
const validateWhitelistProperties = require('./lib/validateWhitelistProperties');
const validateNewUserRoleRequest = require('./lib/validateNewUserRoleRequest');

module.exports = {
  validate,
  validateProperties,
  validateWhitelistProperties,
  ...validateNewUserRoleRequest,
  ...validate,
  ...validateProperties,
};
