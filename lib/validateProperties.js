// Validate the property values format.
const {
    isEmailString,
    isPhoneNumber,
    isUrlSafeString,
    isValidUuidString,
    isSimplePasswordString,
    isPasswordString,
    isNameString,
    isSafeSearchString,
    isCharactersString,
    isValidIntegerString,
    isValidJsonString, isImageUrl
} = require( "./validate" );

function validateProperties( obj ) {
    let returnObj = {};

    for ( let [ key, value ] of Object.entries( obj || {} ) ) {

        switch ( key ) {
            case "first_name" :
            case "username" :
            case "newStatus":
            case "description":
            case "comment":
            case "status":
            case "name":
            case "title" :
            case "brand":
            case "short_description" :
                isNameString( value ) ?
                    returnObj[ key ] = value : null;
                break;
            case "search_string":
            case "searchString":
                isSafeSearchString( value ) ?
                    returnObj[ key ] = value : null;
                break;
            case "password" :
            case "new_password" :
                isSimplePasswordString( value ) ?
                    returnObj[ key ] = value : null;
                break;
            case "strong_password" :
                isPasswordString( value ) ?
                    returnObj[ key ] = value : null;
                break;
            case "email" :
                isEmailString( value ) ?
                    returnObj[ key ] = value : null;
                break;
            case "phone_number":
                isPhoneNumber( value ) ?
                    returnObj[ key ] = value : null;
                break;
            case "token":
            case "email_confirm_token":
            case "verification_token":
                isUrlSafeString( value ) ?
                    returnObj[ key ] = value : null;
                break;
            case "uuid":
            case "item_id":
            case "user_id":
            case "userId":
            case "image_id":
            case "itemId":
            case "orderId":
            case "category_id":
            case "parent_id":
                isValidUuidString( value ) ?
                    returnObj[ key ] = value : null;
                break;
            case "period":
                isCharactersString( value ) ?
                    returnObj[ key ] = value : null;
                break;
            case "offset_number":
            case "number_of_orders":
            case "price":
                isValidIntegerString( value ) ?
                    returnObj[ key ] = value : null;
                break;
            case "about":
                isValidJsonString( value ) ? returnObj[ key ] = value.trim() : null;
                break;
            case "weight":
            case "dimensions":
            case "permission":
                isValidJsonString( JSON.stringify( value ) ) ? returnObj[ key ] = value : null;
                break;
            case "image_url":
                isImageUrl( value ) ? returnObj[ key ] = value : null;
                break;
        }
    }

    return returnObj;
}

module.exports = {
    validateProperties
};
