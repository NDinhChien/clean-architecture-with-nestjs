import { IUserRepository } from '../../../../../infra/persistence/repository/interface/IUserRepository';
import { UserDITokens } from '../../../UserDITokens';
import { IUserEditProfileUseCase } from '../../usecase.interface';
import { Injectable, Inject } from '@nestjs/common';
import { UserPublicInfoDto } from '../../dto/UserPublicInfoDto';
import { UserEditProfilePayload } from './UserEditProfilePayload';
import { UserPublicInfoResData } from '../../dto/res/UserPublicInfoRes';

@Injectable()
export class UserEditProfileUseCase implements IUserEditProfileUseCase {
  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly userRepo: IUserRepository,
  ) {}

  public async execute(
    payload: UserEditProfilePayload,
  ): Promise<UserPublicInfoResData> {
    const { user, ...adapter } = payload;
    await user.editProfile(adapter);
    await this.userRepo.updateOne(user);
    return UserPublicInfoDto.newFromUser(user);
  }
}
