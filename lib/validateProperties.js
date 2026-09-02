// Validate the property values format.
const {
  isEmailString,
  isPhoneNumber,
  isUrlSafeString,
  isValidUuidString,
  isCcIdString,
  validatePassword,
  isNameString,
  isSafeSearchString,
  isCharactersString,
  isValidIntegerString,
  isValidJsonString,
  isImageUrl,
  isValidDomainName,
  isValidTimestampzString,
  isValidTimestampString,
  isValidDateString,
  isBoolValue,
  isValidUrl,
  isValidArrayOfStrings,
  isStreetString,
  isTextString,
  isUserRoleRequestStatusString,
  isUserRoleRequestRoleString,
  isCountryCodeString,
} = require('./validate');

function validateProperties(obj = {}) {
  const returnObj = {};

  for (const [key, value] of Object.entries(obj || {})) {
    switch (key) {
      case 'first_name':
      case 'firstName':
      case 'last_name':
      case 'lastName':
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
      case 'role':
      case 'role_id':
      case 'roleId':
      case 'campus':
      case 'institution_name':
      case 'institutionName':
      case 'program_name':
      case 'programName':
      case 'role_name':
      case 'roleName':
      case 'document_name':
      case 'documentName':
      case 'document_required_for_role_name':
      case 'documentRequiredForRoleName':
      case 'reason':
      case 'entity_type':
      case 'entityType':
      case 'action_type':
      case 'actionType':
      case 'approved_by_role':
      case 'approvedByRole':
      case 'city':
      case 'state':
      case 'country':
      case 'type':
        if (isNameString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'street':
        if (isStreetString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'postal_code':
      case 'postalCode':
        if (isCharactersString(value)) {
          returnObj[key] = value;
        }
        break;

      case 'is_primary':
      case 'isPrimary':
      case 'document_optional':
      case 'documentOptional':
        if (isBoolValue(value)) {
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
        {
          const passwordResult = validatePassword(value);
          if (passwordResult.isValid) {
            returnObj[key] = passwordResult.value;
          }
        }
        break;
      case 'email':
      case 'requested_by_email':
      case 'requestedByEmail':
      case 'approved_by_email':
      case 'approvedByEmail':
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
      case 'country_code':
      case 'countryCode':
        if (isCountryCodeString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'token':
      case 'email_verification_token':
      case 'emailVerificationToken':
      case 'verification_token':
      case 'verificationToken':
        if (isUrlSafeString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'uuid':
      case 'item_id':
      case 'user_id':
      case 'address_id':
      case 'addressId':
      case 'itemId':
      case 'userId':
      case 'order_id':
      case 'orderId':
      case 'category_id':
      case 'categoryId':
      case 'parent_id':
      case 'parentId':
      case 'college_id':
      case 'collegeId':
      case 'campus_id':
      case 'campusId':
      case 'program_id':
      case 'programId':
      case 'program_term_id':
      case 'programTermId':
      case 'template_id':
      case 'templateId':
      case 'program_template_id':
      case 'programTemplateId':
      case 'user_item_id':
      case 'userItemId':
      case 'user_item_status_id':
      case 'userItemStatusId':
      case 'requirement_item_id':
      case 'requirementItemId':
      case 'program_document_id':
      case 'programDocumentId':
      case 'id':
      case 'institution_id':
      case 'institutionId':
      case 'role_assignment_id':
      case 'roleAssignmentId':
      case 'user_role_id':
      case 'userRoleId':
      case 'phone_number_id':
      case 'phoneNumberId':
      case 'entity_id':
      case 'entityId':
      case 'changed_by':
      case 'changedBy':
      case 'request_id':
      case 'requestId':
      case 'approved_by_user_id':
      case 'approvedByUserId':
        if (isValidUuidString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'cc_id':
      case 'ccId':
        if (isCcIdString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'requested_by_name':
      case 'requestedByName':
      case 'document_description':
      case 'documentDescription':
      case 'nick_name':
      case 'nickName':
      case 'requested_by_phone':
      case 'requestedByPhone':
      case 'approved_by_name':
      case 'approvedByName':
      case 'approved_by_phone':
      case 'approvedByPhone':
        if (isTextString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'approved_status':
      case 'approvedStatus':
        if (isUserRoleRequestStatusString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'user_role_request_role':
      case 'userRoleRequestRole':
        if (isUserRoleRequestRoleString(value)) {
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
      case 'from':
      case 'number':
      case 'limit':
      case 'offset':
        if (isValidIntegerString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'about':
        if (isValidJsonString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'weight':
      case 'dimensions':
      case 'permission':
      case 'scope_data':
      case 'scopeData':
      case 'meta_data':
      case 'metaData':
      case 'metadata':
        if (isValidJsonString(JSON.stringify(value))) {
          returnObj[key] = value;
        }
        break;
      case 'aliases':
        if (isValidArrayOfStrings(value)) {
          returnObj[key] = value;
        }
        break;
      case 'image_url':
      case 'imageUrl':
      case 'website':
      case 'file_url':
      case 'fileUrl':
        if (isImageUrl(value) || isValidUrl(value)) {
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
      case 'expires_at':
      case 'expiresAt':
      case 'starts_at':
      case 'startsAt':
      case 'start_time':
      case 'startTime':
      case 'end_time':
      case 'endTime':
      case 'approved_at':
      case 'approvedAt':
        if (isValidTimestampzString(value) || isValidTimestampString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'effective_start_date':
      case 'effectiveStartDate':
      case 'effective_end_date':
      case 'effectiveEndDate':
      case 'valid_until_date':
      case 'validUntilDate':
      case 'renew_date':
      case 'renewDate':
        if (isValidDateString(value)) {
          returnObj[key] = value;
        }
        break;
      case 'active':
        if (isBoolValue(value)) {
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
