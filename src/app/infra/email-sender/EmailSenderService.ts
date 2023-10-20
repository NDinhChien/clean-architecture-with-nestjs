import { Injectable } from '@nestjs/common';
import { IEmailSenderService } from './email-sender.interface';

@Injectable()
export class EmailSenderService implements IEmailSenderService {
  public async sendEmailCode(email: string, code: string): Promise<boolean> {
    return true;
  }

  public async sendResetPassword(
    email: string,
    password: string,
  ): Promise<boolean> {
    return true;
  }
}
