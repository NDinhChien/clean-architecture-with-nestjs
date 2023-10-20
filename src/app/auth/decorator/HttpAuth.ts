import { HttpJwtAuthGuard } from '../guard/HttpJwtAuthGuard';
import { HttpRoleAuthGuard } from '../guard/HttpRoleAuthGuard';
import { HttpRoles } from './HttpRoles';
import { UserRole } from '@core/enums/UserEnums';
import { applyDecorators, UseGuards } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HttpAuth = (...roles: UserRole[]) => {
  return applyDecorators(
    HttpRoles(...roles),
    UseGuards(HttpJwtAuthGuard, HttpRoleAuthGuard),
  );
};
