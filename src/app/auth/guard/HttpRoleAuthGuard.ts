import { HttpRequestWithUser } from '../types/HttpRequestWithUser';
import { Code } from '@core/common/Code';
import { UserRole } from '@core/enums/UserEnums';
import { Exception } from '@core/Exception';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class HttpRoleAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: UserRole[] =
      this.reflector.get<UserRole[]>('roles', context.getHandler()) || [];
    const request: HttpRequestWithUser = context.switchToHttp().getRequest();

    const canActivate: boolean =
      roles.length > 0 ? roles.includes(request.user.getRole()) : true;

    if (!canActivate) {
      throw Exception.new({ code: Code.ACCESS_DENIED_ERROR });
    }

    return canActivate;
  }
}
