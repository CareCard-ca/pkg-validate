import { isNameString, isFileNameString, validate } from '@carecard/validate';

const unknownInput: unknown = '李.pdf';
const acceptedName: boolean = isNameString(unknownInput);
const acceptedFileName: boolean = isFileNameString(unknownInput);
const namespaceFileName: boolean = validate.isFileNameString(unknownInput);
void [acceptedName, acceptedFileName, namespaceFileName];
