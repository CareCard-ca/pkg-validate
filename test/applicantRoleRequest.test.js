'use strict';

const assert = require('node:assert/strict');
const { describe, it } = require('mocha');
const {
  isUserRoleRequestRoleString,
  validateNewUserRoleRequestObject,
  validateWhitelistProperties,
} = require('..');

const scope = {
  institutionId: '71000000-0000-4000-8000-000000000001',
  campusId: '71000000-0000-4000-8000-000000000002',
};

describe('Applicant self-service role request validation', () => {
  it('accepts and normalizes the existing applicant role', () => {
    assert.equal(isUserRoleRequestRoleString('applicant'), true);
    assert.equal(isUserRoleRequestRoleString(' Applicant '), true);
    assert.equal(
      validateNewUserRoleRequestObject({ ...scope, role: ' Applicant ' }).role_name,
      'applicant',
    );
  });

  it('accepts an applicant through the ordinary request whitelist boundary', async () => {
    const result = await validateWhitelistProperties({ role: { role: 'applicant' } }, [
      'role.role',
    ]);
    assert.equal(result.role.role, 'applicant');
  });

  it('retains required institution and campus scope for applicant requests', () => {
    assert.throws(() => validateNewUserRoleRequestObject({ role: 'applicant' }), /Bad_Input/);
    assert.throws(
      () =>
        validateNewUserRoleRequestObject({ role: 'applicant', institutionId: scope.institutionId }),
      /Bad_Input/,
    );
  });

  it('does not allow self-service requests for reviewer or coordinator authority', () => {
    for (const role of [
      'rn_reviewer_institution',
      'rn_reviewer_campus',
      'rn_reviewer_program',
      'co_institution_admin',
      'co_program_coordinator',
    ]) {
      assert.equal(isUserRoleRequestRoleString(role), false);
      assert.throws(() => validateNewUserRoleRequestObject({ ...scope, role }), /Bad_Input/);
    }
  });
});
