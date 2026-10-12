import { normalizeInputWhitespace } from '..';

const name: string = normalizeInputWhitespace(' Name ');
const input = { name: ' Name ', values: [' A '], count: 1 };
const normalized: typeof input = normalizeInputWhitespace(input);
const unknownValue: unknown = normalizeInputWhitespace({ nested: null } as unknown);
void name;
void normalized;
void unknownValue;
