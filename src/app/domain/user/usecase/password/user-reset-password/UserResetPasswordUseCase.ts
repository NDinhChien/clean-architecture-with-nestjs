import { IEmailRepository } from '@app/infra/persistence/repository/interface/IEmailRepository';
import { IKeyRepository } from '@app/infra/persistence/repository/interface/IKeyRepository';
import { IUserRepository } from '@app/infra/persistence/repository/interface/IUserRepository';
import { UserDITokens } from '../../../UserDITokens';
import { IUserResetPasswordUseCase } from '../../usecase.interface';
import { Injectable, Inject } from '@nestjs/common';
import { UserResetPasswordPayload } from './UserResetPasswordPayload';
import { Exception } from '@core/Exception';
import { Code } from '@core/common/Code';
import { InfraDITokens } from '@app/infra/InfraDITokens';
import { IEmailSenderService } from '@app/infra/email-sender/email-sender.interface';
import { ILoginRepository } from '@app/infra/persistence/repository/interface/ILoginRepository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class UserResetPasswordUseCase implements IUserResetPasswordUseCase {
  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly userRepo: IUserRepository,

    @Inject(UserDITokens.EmailRepository)
    private readonly emailRepo: IEmailRepository,

    @Inject(UserDITokens.KeyRepository)
    private readonly keyRepo: IKeyRepository,

    @Inject(UserDITokens.LoginRepository)
    private readonly loginRepo: ILoginRepository,

    @Inject(InfraDITokens.EmailSenderService)
    private readonly emailSender: IEmailSenderService,
  ) {}

  @Transactional()
  public async execute(payload: UserResetPasswordPayload): Promise<void> {
    const user = await this.userRepo.getOne({ email: payload.email });
    if (!user) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'User does not exist.',
      });
    }

    const email = await this.emailRepo.getOne({ email: payload.email });
    if (!email || !email.isVerified()) {
      throw Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: 'Please verify your email first.',
      });
    }

    const newPass = await user.resetPassword();
    await this.userRepo.updateOne(user);
    await this.keyRepo.deleteOne({ email: payload.email }); // logout
    await this.loginRepo.deleteOne({ email: payload.email });
    await this.emailSender.sendResetPassword(payload.email, newPass);
    console.log('Reset password sent: ', newPass);
    await this.emailRepo.deleteOne(email);
  }
}
