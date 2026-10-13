import * as validation from '@carecard/validate';
import type { PropertySchema, SchemaOutput, PasswordValidationResult } from '@carecard/validate';
function expectType<T>(_value: T): void {}
const schema: PropertySchema = { arbitrary: validation.createValueParser(validation.isInteger) };
expectType<SchemaOutput>(validation.validateSchemaProperties({ arbitrary: 1 }, schema));
expectType<Promise<SchemaOutput>>(
  validation.validateSchemaWhitelistProperties({ arbitrary: 1 }, ['arbitrary'], { schema }),
);
expectType<Promise<SchemaOutput>>(
  validation.validateSchemaWhitelistProperties(null, null, {
    schema,
    optionalProperties: ['arbitrary'],
    flattenOutput: true,
    flattenKeyStyle: 'leaf',
    convertToSnakeCase: true,
  }),
);
expectType<PasswordValidationResult>(
  validation.validatePasswordAgainstPolicy('word', {
    minimumLength: 3,
    maximumLength: 9,
    isBlocked: validation.isCommonPassword,
  }),
);
expectType<boolean>(validation.isInStringArray(['arbitrary'], 'arbitrary'));
expectType<boolean>(validation.validate.isNameString('name'));
expectType<5>(validation.MAX_NESTING_DEPTH);
expectType<5000>(validation.MAX_KEYS_PER_CALL);
// @ts-expect-error A caller schema is required.
validation.validateSchemaProperties({ arbitrary: 1 });
// @ts-expect-error A selected path requires explicit parser configuration.
validation.validateSchemaWhitelistProperties({ arbitrary: 1 }, ['arbitrary'], {});
// @ts-expect-error Password length policy belongs to the caller.
validation.validatePasswordAgainstPolicy('word');
const result = validation.validatePasswordAgainstPolicy('word', {
  minimumLength: 1,
  maximumLength: 9,
});
if (result.isValid) {
  expectType<string>(result.value);
} else {
  expectType<validation.PasswordValidationFailureReason>(result.reason);
}
