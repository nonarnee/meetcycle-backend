import { UserRole } from 'src/modules/user/types/user-role.type';

export interface JwtPayload {
  sub: string;
  nickname: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
