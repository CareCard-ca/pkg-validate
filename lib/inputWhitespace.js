'use strict';

// Pattern: Value Boundary - only JSON records and arrays contain contract text to normalize.
function isInputContainer(value) {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return Array.isArray(value) || prototype === Object.prototype || prototype === null;
}

// Pattern: Owned Frame - copies data without invoking setters or changing the supplied record.
function createNormalizationFrame(source, copies, active) {
  const target = Array.isArray(source)
    ? new Array(source.length)
    : Object.create(Object.getPrototypeOf(source));
  copies.set(source, target);
  active.add(source);
  return { source, target, keys: Object.keys(source), index: 0 };
}

// Pattern: Safe Property - rejects ambiguous keys and accessors before reading their values.
function readNormalizationEntry(frame) {
  const rawKey = frame.keys[frame.index++];
  const key = rawKey.trim();
  if (Object.hasOwn(frame.target, key)) {
    throw new TypeError('Ambiguous input keys after whitespace normalization.');
  }
  const descriptor = Object.getOwnPropertyDescriptor(frame.source, rawKey);
  if (!descriptor || !Object.hasOwn(descriptor, 'value')) {
    throw new TypeError('Input must contain data properties.');
  }
  return { key, value: descriptor.value };
}

// Pattern: Graph Traversal - preserves shared records while rejecting cyclic request data.
function normalizeEntryValue(value, copies, active, frames) {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (!isInputContainer(value)) {
    return value;
  }
  if (active.has(value)) {
    throw new TypeError('Cyclic input cannot be normalized.');
  }
  if (!copies.has(value)) {
    frames.push(createNormalizationFrame(value, copies, active));
  }
  return copies.get(value);
}

// Pattern: Canonical Input - trims every text value and own key before domain validation.
function normalizeInputWhitespace(input) {
  if (!isInputContainer(input)) {
    return typeof input === 'string' ? input.trim() : input;
  }
  const copies = new WeakMap();
  const active = new WeakSet();
  const frames = [createNormalizationFrame(input, copies, active)];
  const result = frames[0].target;
  while (frames.length) {
    const frame = frames[frames.length - 1];
    if (frame.index === frame.keys.length) {
      active.delete(frame.source);
      frames.pop();
      continue;
    }
    const { key, value } = readNormalizationEntry(frame);
    Object.defineProperty(frame.target, key, {
      value: normalizeEntryValue(value, copies, active, frames),
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }
  return result;
}

module.exports = { normalizeInputWhitespace };
