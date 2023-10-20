import { IUserRepository } from '../../../../../infra/persistence/repository/interface/IUserRepository';
import { UserDITokens } from '../../../UserDITokens';
import { IUserGetPubProfileUseCase } from '../../usecase.interface';
import { Injectable, Inject } from '@nestjs/common';
import { UserGetPubProfilePayload } from './UserGetPubProfilePayload';
import { Exception } from '../../../../../../core/Exception';
import { Code } from '../../../../../../core/common/Code';
import { UserPublicInfoDto } from '../../dto/UserPublicInfoDto';
import { UserPublicInfoResData } from '../../dto/res/UserPublicInfoRes';

@Injectable()
export class UserGetPubProfileUseCase implements IUserGetPubProfileUseCase {
  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly userRepo: IUserRepository,
  ) {}

  public async execute(
    payload: UserGetPubProfilePayload,
  ): Promise<UserPublicInfoResData> {
    const user = await this.userRepo.getOne({ id: payload.id });
    if (!user) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'User does not exist.',
      });
    }
    return UserPublicInfoDto.newFromUser(user);
  }
}
