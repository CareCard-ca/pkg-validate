'use strict';

const validate = require('./lib/validate');
const { validateSchemaProperties, createValueParser } = require('./lib/schemaProperties');
const schemaWhitelistProperties = require('./lib/schemaWhitelistProperties');

module.exports = {
  validate,
  ...validate,
  ...require('./lib/inputValidation'),
  ...require('./lib/inputWhitespace'),
  ...require('./lib/passwordPolicy'),
  ...schemaWhitelistProperties,
  validateSchemaProperties,
  createValueParser,
};
