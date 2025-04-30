// src/common/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/modules/user/types/user-role.type';
import { Request } from 'express';

// Request에 user 프로퍼티를 추가하기 위한 인터페이스 확장
interface RequestWithUser extends Request {
  user: {
    role: UserRole;
    [key: string]: any;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 메타데이터에서 해당 엔드포인트에 필요한 역할 가져오기
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    // 역할 제한이 없으면 인증만 통과하면 됨 (JWT Guard에 의해 처리됨)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // user 객체가 없거나 role이 없으면 거부
    if (!user || !user.role) {
      throw new ForbiddenException('권한이 없습니다');
    }

    // 사용자의 역할이 필요한 역할 중 하나와 일치하는지 확인
    return requiredRoles.some((role) => user.role === role);
  }
}
