import { Inject, Injectable } from '@nestjs/common';
import { IUserVerifyEmailUseCase } from '../../usecase.interface';
import { UserDITokens } from '../../../UserDITokens';
import { UserVerifyEmailPayload } from './UserVerifyEmailPayload';
import { IEmailRepository } from '@app/infra/persistence/repository/interface/IEmailRepository';
import { Exception } from '@core/Exception';
import { Code } from '@core/common/Code';
import { Rule } from '@app/../config/RuleConfig';

@Injectable()
export class UserVerifyEmailUseCase implements IUserVerifyEmailUseCase {
  constructor(
    @Inject(UserDITokens.EmailRepository)
    private readonly emailRepo: IEmailRepository,
  ) {}

  public async execute(payload: UserVerifyEmailPayload): Promise<void> {
    const email = await this.emailRepo.getOne({ email: payload.email });
    if (!email) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Please issue email code first.',
      });
    }

    email.updateForVerify();
    if (payload.code === email.getCode()) {
      email.setVerified(true);
    }
    await this.emailRepo.updateOne(email);

    if (!email.getVerified()) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: `Wrong code! ${
          Rule.EMAIL.MAX_TRY_TIMES - email.getTriedTimes()
        } times left.`,
      });
    }
  }
}
