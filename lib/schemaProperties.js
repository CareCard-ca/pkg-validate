'use strict';

const { normalizeInputWhitespace } = require('./inputWhitespace');

// Pattern: Parser Composition - adapts caller predicates and transformations to the schema contract.
function createValueParser(predicate, transform = value => value) {
  if (typeof predicate !== 'function' || typeof transform !== 'function') {
    throw new TypeError('Value parser predicate and transform must be functions.');
  }
  return value =>
    predicate(value) === true ? { isValid: true, value: transform(value) } : { isValid: false };
}

// Pattern: Configuration Guard - validates caller-owned parsers without inferring field semantics.
function assertPropertySchema(schema) {
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    throw new TypeError('An explicit property schema is required.');
  }
  if (Object.values(schema).some(parser => typeof parser !== 'function')) {
    throw new TypeError('Every property schema entry must be a parser function.');
  }
}

// Pattern: Safe Reconstruction - preserves reserved-looking keys as ordinary own data.
function defineParsedProperty(target, key, value) {
  Object.defineProperty(target, key, {
    value,
    enumerable: true,
    writable: true,
    configurable: true,
  });
}

// Pattern: Schema Validation - selects only fields explicitly configured by the caller.
function validateSchemaProperties(inputObject, schema) {
  assertPropertySchema(schema);
  const input = normalizeInputWhitespace(inputObject);
  const result = {};
  for (const [key, value] of Object.entries(input || {})) {
    if (!Object.hasOwn(schema, key)) {
      continue;
    }
    const parsed = schema[key](value);
    if (parsed?.isValid === true) {
      defineParsedProperty(result, key, parsed.value);
    }
  }
  return result;
}

module.exports = { assertPropertySchema, validateSchemaProperties, createValueParser };
