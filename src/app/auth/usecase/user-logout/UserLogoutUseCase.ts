import { UserDITokens } from '@app/domain/user/UserDITokens';
import { Inject, Injectable } from '@nestjs/common';
import { IKeyRepository } from '@app/infra/persistence/repository/interface/IKeyRepository';
import { IUserLogoutUseCase } from '../usecase.interface';
import { UserLogoutPayload } from './UserLogoutPayload';
import { ILoginRepository } from '../../../infra/persistence/repository/interface/ILoginRepository';

@Injectable()
export class UserLogoutUseCase implements IUserLogoutUseCase {
  constructor(
    @Inject(UserDITokens.KeyRepository)
    private readonly keyRepo: IKeyRepository,

    @Inject(UserDITokens.LoginRepository)
    private readonly loginRepo: ILoginRepository,
  ) {}

  public async execute(payload: UserLogoutPayload): Promise<void> {
    await this.keyRepo.deleteOne({ user_id: payload.id });
    await this.loginRepo.deleteOne({email: payload.email})
  }
}
