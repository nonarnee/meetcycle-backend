import { UserRole } from 'src/modules/user/types/user-role.type';

export interface AuthResponse {
  access_token?: string;
  id: string;
  nickname: string;
  role: UserRole;
}
