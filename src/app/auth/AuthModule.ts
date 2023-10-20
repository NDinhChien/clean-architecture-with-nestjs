import { UserLoginUseCase } from '../auth/usecase/user-login/UserLoginUseCase';
import { UserLogoutUseCase } from '../auth/usecase/user-logout/UserLogoutUseCase';
import { UserRefreshTokenUseCase } from '../auth/usecase/user-refresh-token/UserRefreshTokenUseCase';
import { HttpJwtStrategy } from '../auth/passport/HttpJwtStrategy';
import { AuthController } from '../auth/AuthController';
import { UserModule } from '../domain/user/UserModule';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { readPrivateKey, readPublicKey } from '../auth/keys/readKey';
import { Rule } from '../../config/RuleConfig';
import { AuthDITokens } from '../auth/AuthDITokens';
import { Provider } from '@nestjs/common';

const useCaseProviders: Provider[] = [
  {
    provide: AuthDITokens.UserLoginUseCase,
    useClass: UserLoginUseCase,
  },
  {
    provide: AuthDITokens.UserLogoutUseCase,
    useClass: UserLogoutUseCase,
  },
  {
    provide: AuthDITokens.UserRefreshTokenUseCase,
    useClass: UserRefreshTokenUseCase,
  },
];

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      privateKey: readPrivateKey(),
      publicKey: readPublicKey(),
      signOptions: { algorithm: 'RS256' },
      verifyOptions: { issuer: Rule.TOKEN.ISSUER, ignoreExpiration: false },
    }),
  ],
  providers: [HttpJwtStrategy, ...useCaseProviders],
})
export class AuthModule {}
