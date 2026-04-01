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
            case 'type':
                if (isNameString(value) || (typeof value === 'object' && value !== null)) {
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
