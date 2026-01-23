const assert = require( 'assert' ).strict;
const { describe, it } = require( 'mocha' );
const validateProperties = require( '../index' ).validateProperties;


describe( 'ValidateProperties test', function () {

    describe( 'Validate function test', function () {

        it( 'fist_name validate', function ( done ) {
            const testObject = { first_name: "Pankaj" };

            const validatedObject = validateProperties.validateProperties( testObject );

            assert.deepStrictEqual( validatedObject, testObject, 'Validation failed' );
            done();
        } );

        it( 'password validate', function ( done ) {
            const testObject = { password: "secret782*goo" };

            const validatedObject = validateProperties.validateProperties( testObject );

            assert.deepStrictEqual( validatedObject, testObject, 'Validation failed' );
            done();
        } );

        it( 'item_id uuid validate', function ( done ) {
            const testObject = { item_id: "1c76ea46-a212-4cc5-9031-a9a28d927c4c" };

            const validatedObject = validateProperties.validateProperties( testObject );

            assert.deepStrictEqual( validatedObject, testObject, 'Validation failed' );
            done();
        } );

        it( 'search_string validate', function ( done ) {
            const testObject_1 = { search_string: "1c76ea46-a212-4cc5-9031-a9a28d927c4c" };
            const testObject_2 = { search_string: " claudpsnd@yahoo.ca " };

            const validatedObject_1 = validateProperties.validateProperties( testObject_1 );
            const validatedObject_2 = validateProperties.validateProperties( testObject_2 );

            assert.deepStrictEqual( validatedObject_1, {}, 'Validation failed' );
            assert.deepStrictEqual( validatedObject_2, testObject_2, 'Validation failed' );
            done();
        } );

        it( 'searchString validate', function ( done ) {
            const testObject_1 = { searchString: "1c76ea46-a212-4cc5-9031-a9a28d927c4c" };
            const testObject_2 = { searchString: " claudpsnd@yahoo.ca " };

            const validatedObject_1 = validateProperties.validateProperties( testObject_1 );
            const validatedObject_2 = validateProperties.validateProperties( testObject_2 );

            assert.deepStrictEqual( validatedObject_1, {}, 'Validation failed' );
            assert.deepStrictEqual( validatedObject_2, testObject_2, 'Validation failed' );
            done();
        } );

        it( 'permission_string validate', function ( done ) {
            const testObject_1 = {
                permission: {
                    resource: "unit_a",
                    name: "south_homes",
                    type: "r"
                }
            };
            const testObject_2 = { permission: { email: "claudpsnd@yahoo.ca" } };

            const validatedObject_1 = validateProperties.validateProperties( testObject_1 );
            const validatedObject_2 = validateProperties.validateProperties( testObject_2 );

            assert.deepStrictEqual( validatedObject_1, testObject_1, 'Validation failed' );
            assert.deepStrictEqual( validatedObject_2, testObject_2, 'Validation failed' );
            done();
        } );

        it( 'domain validation', function ( done ) {
            const testObject1 = { domain: "example.com" };
            const testObject2 = { domain_name: "sub.example.com" };
            const testObject3 = { email_domain: "my-domain.org" };
            const testObject4 = { email_domain_name: "school.edu.in" };
            const testObjectBad = { domain: "invalid_domain" };

            const validatedObject1 = validateProperties.validateProperties( testObject1 );
            const validatedObject2 = validateProperties.validateProperties( testObject2 );
            const validatedObject3 = validateProperties.validateProperties( testObject3 );
            const validatedObject4 = validateProperties.validateProperties( testObject4 );
            const validatedObjectBad = validateProperties.validateProperties( testObjectBad );

            assert.deepStrictEqual( validatedObject1, testObject1, 'Validation failed for domain' );
            assert.deepStrictEqual( validatedObject2, testObject2, 'Validation failed for domain_name' );
            assert.deepStrictEqual( validatedObject3, testObject3, 'Validation failed for email_domain' );
            assert.deepStrictEqual( validatedObject4, testObject4, 'Validation failed for email_domain_name' );
            assert.deepStrictEqual( validatedObjectBad, {}, 'Validation should have failed for invalid domain' );
            done();
        } );
    } );
} );
