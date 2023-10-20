export type CreateEmailEntityPayload = {
  email: string;

  code?: string;
  issuedAt?: Date;

  verified?: boolean;
  triedTimes?: number;
  refreshedTimes?: number;

  lastTryAt?: Date;
};
