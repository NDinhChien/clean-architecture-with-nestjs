import { IUserRepository } from '@app/infra/persistence/repository/interface/IUserRepository';
import { UserDITokens } from '../../../UserDITokens';
import { Injectable, Inject } from '@nestjs/common';
import { Exception } from '@core/Exception';
import { Code } from '@core/common/Code';
import { ILoginRepository } from '@app/infra/persistence/repository/interface/ILoginRepository';
import { Transactional } from 'typeorm-transactional';
import { IUserUpdatePassUseCase } from '../../usecase.interface';
import { UserUpdatePassPayload } from './UserUpdatePassPayload';
import { Optional } from '@core/common/CommonTypes';
import { Login } from '../../../entity/login/Login';
import { Rule } from '@app/../config/RuleConfig';
import { IKeyRepository } from '@app/infra/persistence/repository/interface/IKeyRepository';

@Injectable()
export class UserUpdatePassUseCase implements IUserUpdatePassUseCase {
  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly userRepo: IUserRepository,

    @Inject(UserDITokens.LoginRepository)
    private readonly loginRepo: ILoginRepository,

    @Inject(UserDITokens.KeyRepository)
    private readonly keyRepo: IKeyRepository,

  ) {}

  @Transactional()
  public async execute(payload: UserUpdatePassPayload): Promise<void> {
    const user = payload.user;
    const email = payload.user.getEmail();

    // login challenge
    const login: Optional<Login> = await this.loginRepo.getOne({
      email: email,
    });
    if (!login) {
      await this.loginRepo.createOne(await Login.new({ email: email })); // login for the first time
    } else {
      login.update(); // login for the other times
      await this.loginRepo.updateOne(login);
    }
    if (!(await user.comparePassword(payload.oldPass))) {
      throw Exception.new({
        code: Code.UNAUTHORIZED_ERROR,
        overrideMessage: `Wrong password, ${
          Rule.LOGIN.MAX_TRY_TIMES - (login ? login.getTriedTimes() : 1)
        } times left.`,
      });
    }
    await user.updatePassword(payload.newPass);
    await this.userRepo.updateOne(user);
    await this.keyRepo.deleteOne({ email: email });
    await this.loginRepo.deleteOne({email: email});
  }
}
