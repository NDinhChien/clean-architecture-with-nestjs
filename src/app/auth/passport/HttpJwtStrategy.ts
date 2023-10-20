import { HttpJwtPayload } from '../types/HttpJwtPayload';
import { Code } from '@core/common/Code';
import { Exception } from '@core/Exception';
import { User } from '@app/domain/user/entity/User';
import { Optional } from '../../../core/common/CommonTypes';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Rule } from '../../../config/RuleConfig';
import { Inject } from '@nestjs/common';
import { UserDITokens } from '../../domain/user/UserDITokens';
import { IUserRepository } from '../../infra/persistence/repository/interface/IUserRepository';
import { IKeyRepository } from '../../infra/persistence/repository/interface/IKeyRepository';
import { Key } from '../../domain/user/entity/key/Key';
import { readPublicKey } from '../keys/readKey';

@Injectable()
export class HttpJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly userRepo: IUserRepository,
    @Inject(UserDITokens.KeyRepository)
    private readonly keyRepo: IKeyRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader(Rule.TOKEN.HEADER),
      secretOrKey: readPublicKey(),
    });
  }

  public async validate(payload: HttpJwtPayload): Promise<User> {
    const key: Optional<Key> = await this.keyRepo.getOne({
      user_id: payload.sub,
      accessKey: payload.prm,
    });
    if (!key) {
      throw Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: 'invalid access token',
      });
    } else {
      const user: Optional<User> = await this.userRepo.getOne({
        id: payload.sub,
      });
      if (!user) {
        throw Exception.new({ code: Code.INTERNAL_ERROR });
      }
      return user;
    }
  }
}
