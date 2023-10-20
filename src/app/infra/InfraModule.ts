import { NestHttpExceptionFilter } from '@core/NestHttpExceptionFilter';
import { NestHttpLoggingInterceptor } from '@core/NestHttpLoggingInterceptor';
import { ApiServerConfig } from '@app/../config/ApiServerConfig';
import {
  Global,
  Module,
  OnApplicationBootstrap,
  Provider,
} from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import AppDataSource from '@app/../data-source';
import { InfraDITokens } from '../infra/InfraDITokens';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { EmailSenderService } from './email-sender/EmailSenderService';

const providers: Provider[] = [
  {
    provide: InfraDITokens.EmailSenderService,
    useClass: EmailSenderService,
  },
  {
    provide: APP_FILTER,
    useClass: NestHttpExceptionFilter,
  },
];

if (ApiServerConfig.LOG_ENABLE) {
  providers.push({
    provide: APP_INTERCEPTOR,
    useClass: NestHttpLoggingInterceptor,
  });
}

export const databaseProviders = [
  {
    provide: InfraDITokens.DataSource,
    useFactory: async () => {
      return AppDataSource.initialize();
    },
  },
];

@Global()
@Module({
  providers: [...providers, ...databaseProviders],
  exports: [InfraDITokens.DataSource, InfraDITokens.EmailSenderService],
})
export class InfraModule implements OnApplicationBootstrap {
  onApplicationBootstrap(): void {
    initializeTransactionalContext();
    addTransactionalDataSource(AppDataSource);
  }
}
