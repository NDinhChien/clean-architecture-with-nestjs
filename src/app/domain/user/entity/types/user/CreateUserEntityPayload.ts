import { UserRole } from '@core/enums/UserEnums';

export type CreateUserEntityPayload = {
  email: string;
  password: string;
  role: UserRole;

  birthday?: Date;
  firstName?: string;
  lastName?: string;
  intro?: string;
  removedAt?: Date;

  id?: string;
  createdAt?: Date;
  editedAt?: Date;
};
