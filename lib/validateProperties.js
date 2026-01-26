// Validate the property values format.
const {
  isEmailString,
  isPhoneNumber,
  isUrlSafeString,
  isValidUuidString,
  isSimplePasswordString,
  isPasswordString,
  isString6To16CharacterLong,
  isNameString,
  isSafeSearchString,
  isCharactersString,
  isValidIntegerString,
  isValidJsonString,
  isImageUrl,
  isValidDomainName,
} = require('./validate');

function validateProperties(obj = {}) {
  const returnObj = {};

  for (const [key, value] of Object.entries(obj || {})) {
    switch (key) {
      case 'first_name':
      case 'firstName':
      case 'username':
      case 'new_status':
      case 'newStatus':
      case 'description':
      case 'comment':
      case 'status':
      case 'name':
      case 'title':
      case 'brand':
      case 'short_description':
      case 'shortDescription':
      case 'college_name':
      case 'collegeName':
      case 'campus_name':
      case 'campusName':
        if (isNameString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'search_string':
      case 'searchString':
        if (isSafeSearchString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'password':
      case 'new_password':
      case 'newPassword':
        if (isString6To16CharacterLong(value) && isSimplePasswordString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'strong_password':
      case 'strongPassword':
        if (isString6To16CharacterLong(value) && isPasswordString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'email':
        if (isEmailString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'phone_number':
      case 'phoneNumber':
        if (isPhoneNumber(value)) {
          returnObj[key] = value;
        }
        break;
      case 'token':
      case 'email_confirm_token':
      case 'emailConfirmToken':
      case 'verification_token':
      case 'verificationToken':
        if (isUrlSafeString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'uuid':
      case 'item_id':
      case 'user_id':
      case 'image_id':
      case 'itemId':
      case 'userId':
      case 'imageId':
      case 'order_id':
      case 'orderId':
      case 'category_id':
      case 'categoryId':
      case 'parent_id':
      case 'parentId':
        if (isValidUuidString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'period':
        if (isCharactersString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'offset_number':
      case 'offsetNumber':
      case 'number_of_orders':
      case 'numberOfOrders':
      case 'price':
        if (isValidIntegerString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'about':
        if (isValidJsonString(value)) {
          returnObj[key] = value.trim();
        }
        break;
      case 'weight':
      case 'dimensions':
      case 'permission':
        if (isValidJsonString(JSON.stringify(value))) {
          returnObj[key] = value;
        }
        break;
      case 'image_url':
      case 'imageUrl':
        if (isImageUrl(value)) {
          returnObj[key] = value;
        }
        break;
      case 'domain_name':
      case 'domainName':
      case 'domain':
      case 'email_domain':
      case 'emailDomain':
      case 'email_domain_name':
      case 'emailDomainName':
        if (isValidDomainName(value)) {
          returnObj[key] = value;
        }
        break;
    }
  }

  return returnObj;
}

module.exports = {
  validateProperties,
};
