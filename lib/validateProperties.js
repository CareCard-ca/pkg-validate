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
    isValidTimestampzString,
    isValidTimestampString,
    isBoolValue,
    isValidUrl,
    isValidArrayOfStrings,
    isStreetString,
    isTextString,
    isUserRoleRequestStatusString,
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
            case 'document_type':
            case 'documentType':
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
            case 'address_id':
            case 'addressId':
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
            case 'college_id':
            case 'collegeId':
            case 'campus_id':
            case 'campusId':
            case 'program_id':
            case 'programId':
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
            case 'requested_by_name':
            case 'requestedByName':
            case 'requested_by_email':
            case 'requestedByEmail':
            case 'requested_by_phone':
            case 'requestedByPhone':
            case 'approved_by_name':
            case 'approvedByName':
            case 'approved_by_email':
            case 'approvedByEmail':
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
