import { Optional } from '@core/common/CommonTypes';
import { UserDITokens } from '@app/domain/user/UserDITokens';
import { IUserRepository } from '@app/infra/persistence/repository/interface/IUserRepository';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IKeyRepository } from '@app/infra/persistence/repository/interface/IKeyRepository';
import { IUserRefreshTokenUseCase } from '../usecase.interface';
import { Exception } from '../../../../core/Exception';
import { Code } from '../../../../core/common/Code';
import { Rule } from '../../../../config/RuleConfig';
import { Key } from '../../../domain/user/entity/Key';
import { HttpJwtPayload } from '../../types/HttpJwtPayload';
import { UserRefreshTokenPayload } from './UserRefreshTokenPayload';
import { User } from '../../../domain/user/entity/User';
import { UserRefreshTokenResData } from './UserRefreshTokenDoc';

@Injectable()
export class UserRefreshTokenUseCase implements IUserRefreshTokenUseCase {
  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly userRepo: IUserRepository,

    @Inject(UserDITokens.KeyRepository)
    private readonly keyRepo: IKeyRepository,

    private readonly jwtService: JwtService,
  ) {}

  public async execute(
    payload: UserRefreshTokenPayload,
  ): Promise<UserRefreshTokenResData> {
    const accessPayload: HttpJwtPayload = this.jwtService.verify(
      payload.accessToken,
      { ignoreExpiration: true },
    );
    const user: Optional<User> = await this.userRepo.getOne({
      id: accessPayload.sub,
    });
    if (!user || user.getId() !== accessPayload.sub) {
      throw Exception.new({
        code: Code.UNAUTHORIZED_ERROR,
        overrideMessage: 'invalid access token.',
      });
    }

    const refreshPayload: HttpJwtPayload = this.jwtService.verify(
      payload.refreshToken,
    );
    if (refreshPayload.sub !== accessPayload.sub) {
      throw Exception.new({
        code: Code.UNAUTHORIZED_ERROR,
        overrideMessage: 'invalid refresh token.',
      });
    }

    const key: Optional<Key> = await this.keyRepo.getOne({
      user_id: user.getId(),
      accessKey: accessPayload.prm,
      refreshKey: refreshPayload.prm,
    });
    if (!key) {
      throw Exception.new({
        code: Code.UNAUTHORIZED_ERROR,
        overrideMessage: 'invalid tokens.',
      });
    }
    key.updateKeyString();
    await this.keyRepo.updateOne(key);

    return {
      id: user.getId(),
      accessToken: await this.jwtService.signAsync(
        new HttpJwtPayload(
          user.getId(),
          key.getAccessKey(),
          Rule.TOKEN.ACCESS_TOKEN_VALIDITY,
        ).toPlain(),
      ),
      refreshToken: await this.jwtService.signAsync(
        new HttpJwtPayload(
          user.getId(),
          key.getRefreshKey(),
          Rule.TOKEN.REFRESH_TOKEN_VALIDITY,
        ).toPlain(),
      ),
    };
  }
}
