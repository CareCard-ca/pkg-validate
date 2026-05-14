'use strict';

const {
  error: { throwBadInputError },
  caseConverter: { keysToSnakeCase },
} = require('@carecard/common-util');

const { validateProperties } = require('./validateProperties');

/** Maximum supported nesting depth for dot-notation property paths. */
const MAX_NESTING_DEPTH = 5;

/**
 * Maximum number of property paths (required + optional combined) that can
 * be validated in a single call. Guards against pathologically large or
 * adversarial inputs.
 */
const MAX_KEYS_PER_CALL = 5000;

/**
 * Splits a dot-notation property path into its segments and validates depth.
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
  let current = obj;
  for (let i = 0; i < segments.length - 1; i++) {
    if (current === null || typeof current !== 'object') return { found: false, value: undefined };
    if (!Object.prototype.hasOwnProperty.call(current, segments[i])) return { found: false, value: undefined };
    current = current[segments[i]];
  }
  if (current === null || typeof current !== 'object') return { found: false, value: undefined };
  const leaf = segments[segments.length - 1];
  if (!Object.prototype.hasOwnProperty.call(current, leaf)) return { found: false, value: undefined };
  return { found: true, value: current[leaf] };
}

/**
 * Writes `value` into `target` at the nested location described by `segments`,
 * creating intermediate plain-object nodes as needed.
 *
 * @param {Object} target
 * @param {string[]} segments
 * @param {*} value
 */
function writeLeaf(target, segments, value) {
  let current = target;
  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i];
    if (current[key] === null || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  current[segments[segments.length - 1]] = value;
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
    if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      flattenObject(value, path, out);
    } else {
      out[path] = value;
    }
  }
  return out;
}

/**
 * Validates and transforms whitelisted properties from an input object.
 *
 * Supports nested objects via dot-notation paths (e.g. `'address.city'`),
 * up to {@link MAX_NESTING_DEPTH} levels deep. For each whitelisted path the
 * function checks that the leaf property exists, validates the leaf value
 * using {@link validateProperties} (keyed by the leaf segment), and rebuilds
 * the same nested shape in the returned object.
 *
 * Steps:
 *  1. Extracts only the whitelisted (required + optional) leaf properties.
 *  2. Validates leaf values using {@link validateProperties}.
 *  3. Asserts every required leaf is present and valid; throws otherwise.
 *  4. Asserts any provided optional leaf is valid; throws otherwise.
 *
 * Array values: a leaf value may be an array; in that case the per-leaf
 * validator is applied to each element. The leaf is accepted only when every
 * element passes validation, and the returned value is an array of the
 * validated elements (in the same order).
 *  5. Optionally converts all keys (including nested) to snake_case.
 *  6. Optionally flattens the result so every leaf is a top-level key,
 *     joined by `.` (`flattenOutput`). Applied after snake_case conversion.
 *
 * @param {Object} inputObject - The input object (e.g., req.body / req.params).
 * @param {Array<string>} [requiredProperties=[]] - Leaf paths that MUST be present and valid.
 * @param {Object} [options]
 * @param {Array<string>} [options.optionalProperties=[]] - Leaf paths allowed but not required.
 * @param {boolean} [options.convertToSnakeCase=false] - Whether to convert keys to snake_case.
 * @param {boolean} [options.flattenOutput=false] - Whether to flatten the result so that
 *   every leaf is a top-level key (joined by `.`), with no nested objects in the output.
 * @returns {Promise<Object>} Resolves with the validated (and possibly transformed) object.
 */
function validateWhitelistProperties(
  inputObject,
  requiredProperties = [],
  options = { optionalProperties: [], convertToSnakeCase: false, flattenOutput: false },
) {
  const optionalProperties = (options && options.optionalProperties) || [];
  const convertToSnakeCase = !!(options && options.convertToSnakeCase);
  const flattenOutput = !!(options && options.flattenOutput);

  // Cap the total number of paths to validate per call.
  const totalKeys = (requiredProperties ? requiredProperties.length : 0) + optionalProperties.length;
  if (totalKeys > MAX_KEYS_PER_CALL) {
    throwBadInputError({
      userMessage: `Too many properties to validate: ${totalKeys} (maximum ${MAX_KEYS_PER_CALL})`,
    });
  }

  const requiredPaths = requiredProperties.map(p => ({ raw: p, segments: splitPath(p) }));
  const optionalPaths = optionalProperties.map(p => ({ raw: p, segments: splitPath(p) }));

  let validatedObject = {};

  // Helper: validate a single leaf value by feeding `{ [leafKey]: value }` to
  // `validateProperties` and checking whether the leaf key survived.
  //
  // If `value` is an array, the same per-element validation is applied to
  // every element; the result is an array of validated element values. The
  // leaf is considered valid only when every element passes validation.
  function validateLeafValue(leafKey, value) {
    if (Array.isArray(value)) {
      const validatedArray = [];
      for (const element of value) {
        const out = validateProperties({ [leafKey]: element });
        if (!Object.prototype.hasOwnProperty.call(out, leafKey)) {
          return { valid: false, value: undefined };
        }
        validatedArray.push(out[leafKey]);
      }
      return { valid: true, value: validatedArray };
    }
    const out = validateProperties({ [leafKey]: value });
    if (Object.prototype.hasOwnProperty.call(out, leafKey)) {
      return { valid: true, value: out[leafKey] };
    }
    return { valid: false, value: undefined };
  }

  // 1 + 3. Required paths must exist and be valid.
  requiredPaths.forEach(({ raw, segments }) => {
    const { found, value } = readLeaf(inputObject, segments);
    if (!found) {
      throwBadInputError({ userMessage: `Missing or invalid property: ${raw}` });
    }
    const leafKey = segments[segments.length - 1];
    const { valid, value: validatedValue } = validateLeafValue(leafKey, value);
    if (!valid) {
      throwBadInputError({ userMessage: `Missing or invalid property: ${raw}` });
    }
    writeLeaf(validatedObject, segments, validatedValue);
  });

  // 1 + 4. Optional paths: if provided, must be valid.
  optionalPaths.forEach(({ raw, segments }) => {
    const { found, value } = readLeaf(inputObject, segments);
    if (!found) return;
    const leafKey = segments[segments.length - 1];
    const { valid, value: validatedValue } = validateLeafValue(leafKey, value);
    if (!valid) {
      throwBadInputError({ userMessage: `Invalid property value: ${raw}` });
    }
    writeLeaf(validatedObject, segments, validatedValue);
  });

  // 5. Optional case transformation (recursive, handles nested keys).
  if (convertToSnakeCase) {
    validatedObject = keysToSnakeCase(validatedObject);
  }

  // 6. Optional flattening: produce a flat object with dot-joined keys.
  if (flattenOutput) {
    validatedObject = flattenObject(validatedObject);
  }

  return Promise.resolve(validatedObject);
}

module.exports = validateWhitelistProperties;
module.exports.validateWhitelistProperties = validateWhitelistProperties;
module.exports.MAX_NESTING_DEPTH = MAX_NESTING_DEPTH;
module.exports.MAX_KEYS_PER_CALL = MAX_KEYS_PER_CALL;
