import { Optional } from '@core/common/CommonTypes';
import { UserDITokens } from '@app/domain/user/UserDITokens';
import { IUserRepository } from '@app/infra/persistence/repository/interface/IUserRepository';
import { Inject, Injectable } from '@nestjs/common';
import { IEmailRepository } from '@app/infra/persistence/repository/interface/IEmailRepository';
import { IUserSignUpUseCase } from '../../usecase.interface';
import { User } from '../../../entity/User';
import { Exception } from '../../../../../../core/Exception';
import { Code } from '../../../../../../core/common/Code';
import { UserRole } from '../../../../../../core/enums/UserEnums';
import { UserSignUpPayload } from './UserSignUpPayload';
import { UserSignUpResData } from './UserSignUpDoc';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class UserSignUpUseCase implements IUserSignUpUseCase {
  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly userRepo: IUserRepository,

    @Inject(UserDITokens.EmailRepository)
    private readonly emailRepo: IEmailRepository,
  ) {}

  @Transactional()
  public async execute(payload: UserSignUpPayload): Promise<UserSignUpResData> {
    const user: Optional<User> = await this.userRepo.getOne({
      email: payload.email,
    });
    if (user) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'email is already registered.',
      });
    }

    const email = await this.emailRepo.getOne({ email: payload.email });

    if (!email || !email.isVerified()) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Please verify your email first.',
      });
    }
    //signing up...
    const newUser: User = await User.new({
      email: payload.email,
      password: payload.password,
      role: UserRole.GUEST,
    });
    await this.userRepo.createOne(newUser);
    await this.emailRepo.deleteOne(email);
    return {
      id: newUser.getId(),
      email: newUser.getEmail(),
      role: newUser.getRole(),
    };
  }
}
