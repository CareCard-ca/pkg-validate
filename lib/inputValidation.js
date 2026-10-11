'use strict';

const { isValidIntegerString, isValidJsonString } = require('./validate');

const SINGLE_LINE_TEXT =
  /^[\p{L}\p{M}\p{N}\p{Zs}\p{Pd}\p{Sc}\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji_Modifier}_.,'’‘“”"():;!?/@&#+%=[\]{}*\u200c\u200d]*$/u;
const DOCUMENTATION_SEARCH =
  /^[\x20-\x3b\x3d\x3f-\x7e\p{L}\p{M}\p{N}\p{Zs}\p{Pd}\p{Sc}\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji_Modifier}\u200c\u200d]*$/u;
const HTTP_URL_CHARACTERS =
  /^[-\p{L}\p{M}\p{N}\p{Pd}\p{Sc}\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji_Modifier}._~:/?#[\]@!$&'()*+,;=%\u200c\u200d]+$/u;
const MIME_NAME = '[A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}';
const MIME_TOKEN = "[!#$%&'*+.^_`|~0-9A-Za-z-]+";
const MIME_QUOTED_VALUE =
  '"(?:[\\x20\\x21\\x23-\\x3b\\x3d\\x3f-\\x5b\\x5d-\\x7e]|\\\\[\\x20-\\x3b\\x3d\\x3f-\\x7e])*"';
const MIME_TYPE = new RegExp(
  `^${MIME_NAME}/${MIME_NAME}(?: *; *${MIME_NAME}=(?:${MIME_TOKEN}|${MIME_QUOTED_VALUE}))*$`,
);

function hasRawAndNormalizedCharacters(value, allowlist) {
  if (typeof value !== 'string' || !value.isWellFormed()) {
    return false;
  }
  const rawCharacters = value.replace(
    /[\u2024-\u2026\u207d\u207e\u208d\u208e\ufe10-\ufe19\ufe30-\ufe36\ufe4d-\ufe52\ufe54-\ufe5e\ufe60-\ufe61\ufe68-\ufe6b\uff01-\uff02\uff03-\uff0b\uff0c-\uff0f\uff1a-\uff1b\uff1d\uff1f-\uff20\uff3b\uff3d\uff3f\uff5b\uff5d]/gu,
    '',
  );
  return allowlist.test(rawCharacters) && allowlist.test(value.normalize('NFKC'));
}

/** Character validation only; the owning field defines length and requiredness. */
function isSingleLineTextString(value) {
  return hasRawAndNormalizedCharacters(value, SINGLE_LINE_TEXT);
}

/** Allows LF and CRLF line endings, while rejecting standalone CR. */
function isMultilineTextString(value) {
  return (
    typeof value === 'string' &&
    value.isWellFormed() &&
    isSingleLineTextString(value.replace(/\r\n/g, '\n').replace(/\n/g, ''))
  );
}

function isDocumentationSearchString(value) {
  return hasRawAndNormalizedCharacters(value, DOCUMENTATION_SEARCH);
}

function isHttpUrlString(value) {
  if (!hasRawAndNormalizedCharacters(value, HTTP_URL_CHARACTERS)) {
    return false;
  }
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function isMimeTypeString(value) {
  return (
    typeof value === 'string' && /^[\x20-\x3b\x3d\x3f-\x7e]+$/.test(value) && MIME_TYPE.test(value)
  );
}

function isIdempotencyKeyString(value) {
  return typeof value === 'string' && value.length <= 128 && /^[A-Za-z0-9_.:-]+$/.test(value);
}

function isNonNegativeSafeInteger(value) {
  if (typeof value === 'number') {
    return Number.isSafeInteger(value) && value >= 0;
  }
  return isValidIntegerString(value) && Number.isSafeInteger(Number(value));
}

function isValidUuidV4String(value) {
  return (
    typeof value === 'string' &&
    value.length === 36 &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}

function isJsonContainer(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    (Array.isArray(value) ||
      Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  );
}

function isSafeJsonScalar(value) {
  return (
    value === null ||
    typeof value === 'boolean' ||
    (typeof value === 'number' && Number.isFinite(value)) ||
    (typeof value === 'string' && isMultilineTextString(value))
  );
}

function appendSafeJsonProperties(value, pending) {
  for (const [key, property] of Object.entries(Object.getOwnPropertyDescriptors(value))) {
    if (!property.enumerable) {
      continue;
    }
    if (!isSingleLineTextString(key) || !Object.hasOwn(property, 'value')) {
      return false;
    }
    pending.push({ value: property.value });
  }
  return Object.getOwnPropertySymbols(value).length === 0;
}

function hasSafeJsonTree(root) {
  const ancestors = new Set();
  const pending = [{ value: root }];
  while (pending.length > 0) {
    const { value, finished } = pending.pop();
    if (finished) {
      ancestors.delete(value);
    } else if (!isSafeJsonScalar(value)) {
      if (!isJsonContainer(value) || ancestors.has(value)) {
        return false;
      }
      ancestors.add(value);
      pending.push({ value, finished: true });
      if (!appendSafeJsonProperties(value, pending)) {
        return false;
      }
    }
  }
  return true;
}

/** Extensible JSON object/array, with the existing 10000-code-unit metadata budget. */
function isSafeJsonValue(value) {
  try {
    return (
      isJsonContainer(value) && hasSafeJsonTree(value) && JSON.stringify(value).length <= 10000
    );
  } catch {
    return false;
  }
}

function isSafeJsonString(value) {
  return isValidJsonString(value) && isSafeJsonValue(JSON.parse(value));
}

module.exports = {
  isSingleLineTextString,
  isMultilineTextString,
  isHttpUrlString,
  isMimeTypeString,
  isIdempotencyKeyString,
  isNonNegativeSafeInteger,
  isValidUuidV4String,
  isSafeJsonValue,
  isSafeJsonString,
  isDocumentationSearchString,
};
