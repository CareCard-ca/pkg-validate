import {
  isSingleLineTextString,
  isMultilineTextString,
  isHttpUrlString,
  isMimeTypeString,
  isIdempotencyKeyString,
  isNonNegativeSafeInteger,
  isValidUuidV4String,
  isSafeJsonValue,
  isDocumentationSearchString,
  isSafeJsonString,
} from '@carecard/validate';

const input: unknown = { label: 'Example' };
const results: boolean[] = [
  isSingleLineTextString(input),
  isMultilineTextString(input),
  isHttpUrlString(input),
  isMimeTypeString(input),
  isIdempotencyKeyString(input),
  isNonNegativeSafeInteger(input),
  isValidUuidV4String(input),
  isSafeJsonValue(input),
  isDocumentationSearchString(input),
  isSafeJsonString(input),
];
void results;
