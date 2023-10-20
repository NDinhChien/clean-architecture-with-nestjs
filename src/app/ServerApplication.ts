import { RootModule } from './RootModule';
import { ApiServerConfig } from '@app/../config/ApiServerConfig';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { Rule } from '../config/RuleConfig';

export class ServerApplication {
  private readonly host: string = ApiServerConfig.HOST;

  private readonly port: number = ApiServerConfig.PORT;

  public async run(): Promise<void> {
    const app: NestExpressApplication =
      await NestFactory.create<NestExpressApplication>(RootModule);

    this.buildAPIDocumentation(app);
    this.log();

    await app.listen(this.port, this.host);
  }

  private buildAPIDocumentation(app: NestExpressApplication): void {
    const title: string = 'MiracleForYou';
    const description: string = 'MiracleForYou API documentation';
    const version: string = '1.0.0';

    const options: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addBearerAuth({ type: 'apiKey', in: 'header', name: Rule.TOKEN.HEADER })
      .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('api', app, document);
  }

  private log(): void {
    Logger.log(
      `Server started on host: ${this.host}; port: ${this.port};`,
      ServerApplication.name,
    );
  }

  public static new(): ServerApplication {
    return new ServerApplication();
  }
}
