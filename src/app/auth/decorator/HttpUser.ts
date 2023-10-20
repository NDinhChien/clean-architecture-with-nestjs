import { HttpRequestWithUser } from '../types/HttpRequestWithUser';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HttpUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: HttpRequestWithUser = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
