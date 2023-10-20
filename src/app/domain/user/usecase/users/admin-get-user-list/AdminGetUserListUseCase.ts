import { IUserRepository } from '../../../../../infra/persistence/repository/interface/IUserRepository';
import { UserDITokens } from '../../../UserDITokens';
import { UserInfoResData } from '../../dto/res/UserInfoRes';
import { IAdminGetUserListUseCase } from '../../usecase.interface';
import { Injectable, Inject } from '@nestjs/common';
import { AdminGetUserListPayload } from './AdminGetUserListPayload';
import { UserInfoDto } from '../../dto/UserInfoDto';

@Injectable()
export class AdminGetUserListUseCase implements IAdminGetUserListUseCase {
  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly userRepo: IUserRepository,
  ) {}

  public async execute(
    payload: AdminGetUserListPayload,
  ): Promise<UserInfoResData[]> {
    const users = await this.userRepo.getMany({
      offset: payload.offset,
      limit: payload.limit,
      includeRemoved: payload.includeRemoved,
    });

    return UserInfoDto.newListFromUsers(users);
  }
}
