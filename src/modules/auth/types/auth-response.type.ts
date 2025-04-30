import { UserRole } from 'src/modules/user/types/user-role.type';

export interface AuthResponse {
  id: string;
  nickname: string;
  role: UserRole;
}
