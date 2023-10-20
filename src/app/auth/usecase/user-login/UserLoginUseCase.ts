import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '../../../../core/Exception';
import { UserDITokens } from '@app/domain/user/UserDITokens';
import { Rule } from '../../../../config/RuleConfig';
import { JwtService } from '@nestjs/jwt';
import { HttpJwtPayload } from '../../types/HttpJwtPayload';
import { Code } from '../../../../core/common/Code';
import { Login } from '../../../domain/user/entity/login/Login';
import { Key } from '../../../domain/user/entity/key/Key';
import { IUserRepository } from '@app/infra/persistence/repository/interface/IUserRepository';
import { IKeyRepository } from '@app/infra/persistence/repository/interface/IKeyRepository';
import { ILoginRepository } from '@app/infra/persistence/repository/interface/ILoginRepository';
import { UserLoginPayload } from './UserLoginPayload';
import { UserLoginResData } from './UserLoginDoc';
import { IUserLoginUseCase } from '../usecase.interface';

@Injectable()
export class UserLoginUseCase implements IUserLoginUseCase {
  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly userRepo: IUserRepository,

    @Inject(UserDITokens.KeyRepository)
    private readonly keyRepo: IKeyRepository,

    @Inject(UserDITokens.LoginRepository)
    private readonly loginRepo: ILoginRepository,

    private readonly jwtService: JwtService,
  ) {}

  public async execute(payload: UserLoginPayload): Promise<UserLoginResData> {
    const user = await this.userRepo.getOne({ email: payload.email }, {includeRemoved: true});
    if (!user) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'User does not exist.',
      });
    }
    if (user.getRemovedAt() !== null) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'User is currently invalid.',
      });
    }
    const email = user.getEmail();
    const id = user.getId();

    // can i login?
    const login = await this.loginRepo.getOne({ email: email });
    if (!login) {
      await this.loginRepo.createOne(await Login.new({ email: email })); // login for the first time
    } else {
      login.update();
      await this.loginRepo.updateOne(login); // login for the other times
    }

    if (!(await user.comparePassword(payload.password))) {
      throw Exception.new({
        code: Code.WRONG_CREDENTIALS_ERROR,
        overrideMessage: `Wrong password, ${
          Rule.LOGIN.MAX_TRY_TIMES - (login ? login.getTriedTimes() : 1)
        } times left.`,
      });
    }

    const key = await Key.new({ user_id: id, email: email });
    await this.keyRepo.upsertOne(key);
    await this.loginRepo.deleteOne({ email: email });
    return {
      id: id,
      accessToken: this.jwtService.sign(
          new HttpJwtPayload(
            id,
            key.getAccessKey(),
            Rule.TOKEN.ACCESS_TOKEN_VALIDITY,
          ).toPlain(),
      ),
      refreshToken: this.jwtService.sign(
        new HttpJwtPayload(
          id,
          key.getRefreshKey(),
          Rule.TOKEN.REFRESH_TOKEN_VALIDITY,
        ).toPlain()
      ),
    }
  }
}
