import {
  isNameString,
  isFileNameString,
  isTextString,
  isPhoneContactString,
  isReactionString,
  validate,
} from '@carecard/validate';

const unknownInput: unknown = '李.pdf';
const acceptedName: boolean = isNameString(unknownInput);
const acceptedFileName: boolean = isFileNameString(unknownInput);
const namespaceFileName: boolean = validate.isFileNameString(unknownInput);
const acceptedText: boolean = isTextString(unknownInput);
const acceptedPhoneContact: boolean = isPhoneContactString(unknownInput);
const acceptedReaction: boolean = isReactionString(unknownInput);
const namespaceReaction: boolean = validate.isReactionString(unknownInput);
void [
  acceptedName,
  acceptedFileName,
  namespaceFileName,
  acceptedText,
  acceptedPhoneContact,
  acceptedReaction,
  namespaceReaction,
];
