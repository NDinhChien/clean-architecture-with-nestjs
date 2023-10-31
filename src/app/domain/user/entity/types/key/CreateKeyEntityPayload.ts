export type CreateKeyEntityPayload = {
  user_id: string;
  email: string;

  accessKey?: string;
  refreshKey?: string;
};
