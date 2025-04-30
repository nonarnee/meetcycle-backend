import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/user/types/user-role.type';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
