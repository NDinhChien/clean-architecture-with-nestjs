import { AuthModule } from './auth/AuthModule';
import { InfraModule } from './infra/InfraModule';
import { UserModule } from './domain/user/UserModule';
import { Module } from '@nestjs/common';

@Module({
  imports: [InfraModule, AuthModule, UserModule],
})
export class RootModule {}
