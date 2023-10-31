export type CreateLoginEntityPayload = {
  email: string;
  triedTimes?: number;
  lastTryAt?: Date;
};
