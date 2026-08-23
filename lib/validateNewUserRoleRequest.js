'use strict';

const {
  error: { throwBadInputError },
} = require('@carecard/common-util');
const { isUserRoleRequestRoleString } = require('./validate');

const DEFAULT_USER_ROLE_REQUEST_ROLE = 'student';
const REQUIRE_SCOPE_WHEN_ROLE_OR_SCOPE_PRESENT = 'whenRoleOrScopePresent';

// Pattern: Boundary Normalizer - returns canonical persisted fields for supported caller shapes.
function validateNewUserRoleRequestObject(roleRequest = {}, options = {}) {
  const normalized = normalizeNewUserRoleRequestObject(roleRequest);
  const { defaultRole, requireScope } = readNewUserRoleRequestOptions(options);

  if (normalized.role_name === undefined && defaultRole !== undefined) {
    normalized.role_name = defaultRole;
  }

  normalizeNewUserRoleRequestRole(normalized);

  if (shouldRequireScope(normalized, requireScope)) {
    requireNewUserRoleRequestScope(normalized);
  }

  return normalized;
}

// Pattern: Options Object - supplies stable defaults for untyped JavaScript callers.
function readNewUserRoleRequestOptions(options) {
  const validatedOptions = options && typeof options === 'object' ? options : {};
  return {
    defaultRole: Object.hasOwn(validatedOptions, 'defaultRole')
      ? validatedOptions.defaultRole
      : DEFAULT_USER_ROLE_REQUEST_ROLE,
    requireScope: Object.hasOwn(validatedOptions, 'requireScope')
      ? validatedOptions.requireScope
      : true,
  };
}

// Pattern: Canonicalization - validates and normalizes the persisted role enum in one boundary.
function normalizeNewUserRoleRequestRole(roleRequest) {
  if (roleRequest.role_name === undefined) {
    return;
  }
  if (!isUserRoleRequestRoleString(roleRequest.role_name)) {
    throwBadInputError({
      userMessage: 'Invalid property: role.role',
      details: { role: 'Role requests are limited to student, intern, or volunteer' },
    });
  }
  roleRequest.role_name = roleRequest.role_name.trim().toLowerCase();
}

function normalizeNewUserRoleRequestObject(roleRequest) {
  const normalized = { ...roleRequest };

  assignAlias(normalized, 'role_name', 'roleName');
  assignAlias(normalized, 'role_name', 'role');
  assignAlias(normalized, 'institution_id', 'institutionId');
  assignAlias(normalized, 'campus_id', 'campusId');
  assignAlias(normalized, 'program_id', 'programId');
  assignAlias(normalized, 'program_term_id', 'programTermId');

  delete normalized.roleName;
  delete normalized.role;
  delete normalized.institutionId;
  delete normalized.campusId;
  delete normalized.programId;
  delete normalized.programTermId;

  return normalized;
}

function assignAlias(target, canonicalKey, aliasKey) {
  if (target[canonicalKey] === undefined && target[aliasKey] !== undefined) {
    target[canonicalKey] = target[aliasKey];
  }
}

function shouldRequireScope(roleRequest, requireScope) {
  if (requireScope === true) {
    return true;
  }
  if (requireScope !== REQUIRE_SCOPE_WHEN_ROLE_OR_SCOPE_PRESENT) {
    return false;
  }

  return (
    roleRequest.role_name !== undefined ||
    roleRequest.institution_id !== undefined ||
    roleRequest.campus_id !== undefined ||
    roleRequest.program_id !== undefined ||
    roleRequest.program_term_id !== undefined
  );
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
