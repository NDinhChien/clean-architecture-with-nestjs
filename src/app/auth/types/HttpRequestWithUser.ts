import { Request } from 'express';
import { User } from '../../domain/user/entity/User';

export type HttpRequestWithUser = Request & { user: User };
