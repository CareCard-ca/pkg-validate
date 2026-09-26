import { validateNewUserRoleRequestObject, type UserRoleRequestRole } from '..';

const applicant: UserRoleRequestRole = 'applicant';

validateNewUserRoleRequestObject(
  {
    institutionId: '71000000-0000-4000-8000-000000000001',
    campusId: '71000000-0000-4000-8000-000000000002',
  },
  { defaultRole: applicant },
);
