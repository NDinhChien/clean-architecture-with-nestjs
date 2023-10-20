
export interface IEmailSenderService {
  sendEmailCode(email: string, content: string): Promise<boolean>;
  sendResetPassword(email: string, password: string): Promise<boolean>;
}
