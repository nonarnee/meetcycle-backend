import { UserRole } from 'src/modules/user/types/user-role.type';

export interface AuthResponse {
  id: string;
  access_token: string;
  nickname: string;
  email: string;
  role: UserRole;
}
