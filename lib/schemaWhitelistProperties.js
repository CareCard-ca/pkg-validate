'use strict';

const { keysToSnakeCase } = require('@carecard/common-util/case-converter');
const { throwBadInputError } = require('@carecard/common-util/errors');

const { assertPropertySchema } = require('./schemaProperties');
const { normalizeInputWhitespace } = require('./inputWhitespace');

// Pattern: Canonical Boundary - resolves trimmed request keys before required/optional selection.
function validateSchemaWhitelistProperties(inputObject, requiredProperties, options) {
  let canonicalInput;
  try {
    canonicalInput = normalizeInputWhitespace(inputObject);
  } catch {
    throwBadInputError({ userMessage: 'Invalid or ambiguous request input.' });
  }
  return validateCanonicalWhitelistProperties(canonicalInput, requiredProperties, options);
}

/** Maximum supported nesting depth for dot-notation property paths. */
const MAX_NESTING_DEPTH = 5;

/**
 * Maximum number of property paths (required + optional combined) that can
 * be validated in a single call. Guards against pathologically large or
 * adversarial inputs.
 */
const MAX_KEYS_PER_CALL = 5000;
const DEFAULT_FLATTEN_KEY_STYLE = 'path';
const VALID_FLATTEN_KEY_STYLES = new Set(['path', 'leaf']);

/**
 * Returns true if the segment contains a mix of snake_case (underscore) and
 * camelCase (uppercase letter), e.g. `my_mixName`. Such names are ambiguous
 * and are not supported.
 * @param {string} segment
 * @returns {boolean}
 */
function isMixedCaseSegment(segment) {
  return /_/.test(segment) && /[A-Z]/.test(segment);
}

/**
 * Converts a snake_case identifier to camelCase. Leaves identifiers without
 * underscores unchanged.
 * @param {string} s
 * @returns {string}
 */
function snakeToCamel(s) {
  return s.replace(/_([a-zA-Z0-9])/g, (_, c) => c.toUpperCase());
}

/**
 * Converts a camelCase identifier to snake_case. Leaves identifiers without
 * uppercase letters unchanged.
 * @param {string} s
 * @returns {string}
 */
function camelToSnake(s) {
  return s.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);
}

/**
 * Returns the alternate-case form of the segment:
 *  - snake_case -> camelCase
 *  - camelCase  -> snake_case
 *  - otherwise (no `_` and no uppercase) the segment itself.
 * @param {string} segment
 * @returns {string}
 */
function alternateCase(segment) {
  if (segment.indexOf('_') !== -1) {
    return snakeToCamel(segment);
  }
  if (/[A-Z]/.test(segment)) {
    return camelToSnake(segment);
  }
  return segment;
}

/**
 * Splits a dot-notation property path into its segments and validates depth
 * and per-segment casing (mixed snake/camel segments are rejected).
 * @param {string} path
 * @returns {string[]}
 */
function splitPath(path) {
  const segments = String(path).split('.');
  if (segments.length > MAX_NESTING_DEPTH) {
    throwBadInputError({
      userMessage: `Property path "${path}" exceeds maximum nesting depth of ${MAX_NESTING_DEPTH}`,
    });
  }
  for (const seg of segments) {
    if (isMixedCaseSegment(seg)) {
      throwBadInputError({
        userMessage: `Property path "${path}" has a segment "${seg}" mixing snake_case and camelCase`,
      });
    }
  }
  return segments;
}

/**
 * Reads the leaf value at `path` from `obj`. Returns `{ found, value }`.
 * `found` is true only if every intermediate node exists and the final
 * `hasOwnProperty(leaf)` check passes.
 *
 * @param {*} obj
 * @param {string[]} segments
 * @returns {{ found: boolean, value: any }}
 */
function readLeaf(obj, segments) {
  // Resolve a segment against the current node, trying its as-written form
  // first and then its alternate snake/camel form. Returns the actual key
  // present in the node, or undefined if neither form exists.
  function resolveKey(node, seg) {
    if (Object.prototype.hasOwnProperty.call(node, seg)) {
      return seg;
    }
    const alt = alternateCase(seg);
    if (alt !== seg && Object.prototype.hasOwnProperty.call(node, alt)) {
      return alt;
    }
    return undefined;
  }

  let current = obj;
  for (let i = 0; i < segments.length - 1; i++) {
    if (current === null || typeof current !== 'object') {
      return { found: false, value: undefined };
    }
    const key = resolveKey(current, segments[i]);
    if (key === undefined) {
      return { found: false, value: undefined };
    }
    current = current[key];
  }
  if (current === null || typeof current !== 'object') {
    return { found: false, value: undefined };
  }
  const leafKey = resolveKey(current, segments[segments.length - 1]);
  if (leafKey === undefined) {
    return { found: false, value: undefined };
  }
  return { found: true, value: current[leafKey] };
}

/**
 * Writes `value` into `target` at the nested location described by `segments`,
 * creating intermediate plain-object nodes as needed.
 *
 * @param {Object} target
 * @param {string[]} segments
 * @param {*} value
 */
function defineWhitelistDataProperty(target, key, value) {
  Object.defineProperty(target, key, {
    value,
    enumerable: true,
    writable: true,
    configurable: true,
  });
}

function writeLeaf(target, segments, value) {
  let current = target;
  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i];
    if (!Object.hasOwn(current, key) || current[key] === null || typeof current[key] !== 'object') {
      defineWhitelistDataProperty(current, key, {});
    }
    current = current[key];
  }
  defineWhitelistDataProperty(current, segments[segments.length - 1], value);
}

/**
 * Recursively flattens a nested plain object so every leaf becomes a top-level
 * key. Keys are joined by `.`; the original nested shape is discarded.
 *
 * Example: `{ a: { b: { c: 1 } }, d: 2 }` => `{ 'a.b.c': 1, d: 2 }`.
 *
 * @param {Object} obj
 * @param {string} [prefix]
 * @param {Object} [out]
 * @returns {Object}
 */
function flattenObject(obj, prefix = '', out = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      flattenObject(value, path, out);
    } else {
      defineWhitelistDataProperty(out, path, value);
    }
  }
  return out;
}

/**
 * Recursively flattens a nested plain object using only each leaf property
 * name as the output key.
 *
 * Example: `{ a: { b: { c: 1, d: 2 } } }` => `{ c: 1, d: 2 }`.
 * If duplicate leaf keys exist at different nesting levels, the higher-level
 * leaf wins. If duplicate leaf keys exist at the same depth, the first
 * traversal wins.
 *
 * @param {Object} obj
 * @param {Object} [out]
 * @param {Object} [depthByKey]
 * @param {number} [depth]
 * @returns {Object}
 */
function flattenObjectByLeafKey(obj, out = {}, depthByKey = {}, depth = 1) {
  for (const [key, value] of Object.entries(obj)) {
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      flattenObjectByLeafKey(value, out, depthByKey, depth + 1);
    } else {
      if (!Object.prototype.hasOwnProperty.call(out, key) || depth < depthByKey[key]) {
        defineWhitelistDataProperty(out, key, value);
        defineWhitelistDataProperty(depthByKey, key, depth);
      }
    }
  }
  return out;
}

// Pattern: Configuration Guard - requires one explicit parser for every selected path.
function readSchemaPaths(requiredProperties, options) {
  const paths = [
    ...(requiredProperties || []).map(raw => ({ raw, segments: splitPath(raw), required: true })),
    ...(options.optionalProperties || []).map(raw => ({
      raw,
      segments: splitPath(raw),
      required: false,
    })),
  ];
  if (paths.length > MAX_KEYS_PER_CALL) {
    throwBadInputError({
      userMessage: `Too many properties to validate: ${paths.length} (maximum ${MAX_KEYS_PER_CALL})`,
    });
  }
  assertPropertySchema(options.schema);
  for (const path of paths) {
    if (!Object.hasOwn(options.schema, path.raw)) {
      throw new TypeError(`Missing property parser: ${path.raw}`);
    }
  }
  return paths;
}

// Pattern: Collection Parser - preserves ordered per-element validation without field-name inference.
function parseLeafValue(value, parser) {
  if (!Array.isArray(value)) {
    return parser(value);
  }
  const result = [];
  for (const element of value) {
    const parsed = parser(element);
    if (parsed?.isValid !== true) {
      return { isValid: false };
    }
    result.push(parsed.value);
  }
  return { isValid: true, value: result };
}

// Pattern: Boundary Validation - preserves required and optional request error outcomes.
function validateSchemaPath(inputObject, target, path, parser) {
  const { found, value } = readLeaf(inputObject, path.segments);
  if (!found && !path.required) {
    return;
  }
  const parsed = found ? parseLeafValue(value, parser) : null;
  if (parsed?.isValid !== true) {
    const message = path.required ? 'Missing or invalid property' : 'Invalid property value';
    throwBadInputError({ userMessage: `${message}: ${path.raw}` });
  }
  writeLeaf(target, path.segments, parsed.value);
}

// Pattern: Output Transformation - applies only the explicitly selected generic representation.
function transformSchemaResult(result, options) {
  const converted = options.convertToSnakeCase ? keysToSnakeCase(result) : result;
  if (!options.flattenOutput) {
    return converted;
  }
  return options.flattenKeyStyle === 'leaf'
    ? flattenObjectByLeafKey(converted)
    : flattenObject(converted);
}

// Pattern: Schema Composition - combines caller-owned parsers with generic path selection.
function validateCanonicalWhitelistProperties(inputObject, requiredProperties = [], options) {
  const configuration = options || {};
  const style = configuration.flattenKeyStyle ?? DEFAULT_FLATTEN_KEY_STYLE;
  if (!VALID_FLATTEN_KEY_STYLES.has(style)) {
    throwBadInputError({
      userMessage: `Invalid flattenKeyStyle: ${String(style)}. Expected "path" or "leaf"`,
    });
  }
  const paths = readSchemaPaths(requiredProperties, configuration);
  const result = {};
  for (const path of paths) {
    validateSchemaPath(inputObject, result, path, configuration.schema[path.raw]);
  }
  return Promise.resolve(transformSchemaResult(result, configuration));
}

module.exports = { validateSchemaWhitelistProperties, MAX_NESTING_DEPTH, MAX_KEYS_PER_CALL };
