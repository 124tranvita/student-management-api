import { Role } from './auth/roles/role.enum';

export const convertRole = (role: string) => {
  return role === '0' ? Role.Mentor : Role.Admin;
};
