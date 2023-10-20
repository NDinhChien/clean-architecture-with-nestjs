import { IAdminGetUserUseCase } from '../../usecase.interface';
import { Injectable, Inject } from '@nestjs/common';
import { UserDITokens } from '../../../UserDITokens';
import { IUserRepository } from '@app/infra/persistence/repository/interface/IUserRepository';
import { UserInfoResData } from '../../dto/res/UserInfoRes';
import { AdminGetUserPayload } from './AdminGetUserPayload';
import { UserInfoDto } from '../../dto/UserInfoDto';
import { Exception } from '../../../../../../core/Exception';
import { Code } from '../../../../../../core/common/Code';

@Injectable()
export class AdminGetUserUseCase implements IAdminGetUserUseCase {
  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly userRepo: IUserRepository,
  ) {}

  public async execute(payload: AdminGetUserPayload): Promise<UserInfoResData> {
    const user = await this.userRepo.getOne({ id: payload.id });
    if (!user) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'User does not exist.',
      });
    }
    return UserInfoDto.newFromUser(user);
  }
}
