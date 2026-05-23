'use strict';

const {
    error: { throwBadInputError },
} = require('@carecard/common-util');
const { isUserRoleRequestRoleString } = require('./validate');

const DEFAULT_USER_ROLE_REQUEST_ROLE = 'student';
const REQUIRE_SCOPE_WHEN_ROLE_OR_SCOPE_PRESENT = 'whenRoleOrScopePresent';

function validateNewUserRoleRequestObject(roleRequest = {}, options = {}) {
    const normalized = normalizeNewUserRoleRequestObject(roleRequest);
    const defaultRole = Object.prototype.hasOwnProperty.call(options, 'defaultRole') ? options.defaultRole : DEFAULT_USER_ROLE_REQUEST_ROLE;
    const requireScope = Object.prototype.hasOwnProperty.call(options, 'requireScope') ? options.requireScope : true;

    if (normalized.role_name === undefined && defaultRole !== undefined) {
        normalized.role_name = defaultRole;
    }

    if (normalized.role_name !== undefined && !isUserRoleRequestRoleString(normalized.role_name)) {
        throwBadInputError({
            userMessage: 'Invalid property: role.role',
            details: { role: 'Role requests are limited to student, intern, or volunteer' },
        });
    }

    if (shouldRequireScope(normalized, requireScope)) {
        requireNewUserRoleRequestScope(normalized);
    }

    return normalized;
}

function normalizeNewUserRoleRequestObject(roleRequest) {
    const normalized = { ...roleRequest };

    assignAlias(normalized, 'role_name', 'roleName');
    assignAlias(normalized, 'role_name', 'role');
    assignAlias(normalized, 'institution_id', 'institutionId');
    assignAlias(normalized, 'campus_id', 'campusId');
    assignAlias(normalized, 'program_id', 'programId');

    delete normalized.roleName;
    delete normalized.role;
    delete normalized.institutionId;
    delete normalized.campusId;
    delete normalized.programId;

    return normalized;
}

function assignAlias(target, canonicalKey, aliasKey) {
    if (target[canonicalKey] === undefined && target[aliasKey] !== undefined) {
        target[canonicalKey] = target[aliasKey];
    }
}

function shouldRequireScope(roleRequest, requireScope) {
    if (requireScope === true) return true;
    if (requireScope !== REQUIRE_SCOPE_WHEN_ROLE_OR_SCOPE_PRESENT) return false;

    return roleRequest.role_name !== undefined || roleRequest.institution_id !== undefined || roleRequest.campus_id !== undefined;
}

function requireNewUserRoleRequestScope(roleRequest) {
    if (!roleRequest.institution_id) {
        throwBadInputError({ userMessage: 'Missing property: role.institutionId' });
    }

    if (!roleRequest.campus_id) {
        throwBadInputError({ userMessage: 'Missing property: role.campusId' });
    }
}

module.exports = {
    DEFAULT_USER_ROLE_REQUEST_ROLE,
    REQUIRE_SCOPE_WHEN_ROLE_OR_SCOPE_PRESENT,
    validateNewUserRoleRequestObject,
};
