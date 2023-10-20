import { Inject, Injectable } from '@nestjs/common';
import { IIssueEmailCodeUseCase } from '../../usecase.interface';
import { IEmailRepository } from '@app/infra/persistence/repository/interface/IEmailRepository';
import { UserDITokens } from '../../../UserDITokens';
import { IssueEmailCodePayload } from './IssueEmailCodePayload';
import { Email } from '../../../entity/email/Email';
import { InfraDITokens } from '@app/infra/InfraDITokens';
import { IEmailSenderService } from '@app/infra/email-sender/email-sender.interface';

@Injectable()
export class IssueEmailCodeUseCase implements IIssueEmailCodeUseCase {
  constructor(
    @Inject(UserDITokens.EmailRepository)
    private readonly emailRepo: IEmailRepository,

    @Inject(InfraDITokens.EmailSenderService)
    private readonly emailSender: IEmailSenderService,
  ) {}

  public async execute(payload: IssueEmailCodePayload): Promise<void> {
    const email = await this.emailRepo.getOne({ email: payload.email });
    if (!email) {
      await this.emailRepo.createOne(await Email.new({ email: payload.email }));
    } else {
      email.updateForIssue();
      await this.emailRepo.updateOne(email);
      await this.emailSender.sendEmailCode(email.getEmail(), email.getCode());
      console.log('Send email code: ', email.getCode());
    }
  }
}
