import { CoreApiResponse } from './CoreApiResponse';
import { Code } from './common/Code';
import { Exception } from './Exception';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiServerConfig } from '../config/ApiServerConfig';

@Catch()
export class NestHttpExceptionFilter implements ExceptionFilter {
  public catch(error: Error, host: ArgumentsHost): void {
    const request: Request = host.switchToHttp().getRequest();
    const response: Response = host.switchToHttp().getResponse<Response>();

    let errorResponse: CoreApiResponse<unknown> = CoreApiResponse.error(
      Code.INTERNAL_ERROR.code,
      error.message,
    );
    errorResponse = this.handleNestError(error, errorResponse);
    errorResponse = this.handleCoreException(error, errorResponse);

    const message: string =
      `Method: ${request.method}; ` +
      `Path: ${request.path}; ` +
      `Error: ${errorResponse.message}`;

    Logger.error(message);

    if (errorResponse.code === 500 && ApiServerConfig.ENV === 'production') {
      errorResponse.message = 'Server internall error';
    }
    response.json(errorResponse);
  }

  private handleNestError(
    error: Error,
    errorResponse: CoreApiResponse<unknown>,
  ): CoreApiResponse<unknown> {
    if (error instanceof HttpException) {
      errorResponse = CoreApiResponse.error(
        error.getStatus(),
        error.message,
        null,
      );
    }
    return errorResponse;
  }

  private handleCoreException(
    error: Error,
    errorResponse: CoreApiResponse<unknown>,
  ): CoreApiResponse<unknown> {
    if (error instanceof Exception) {
      errorResponse = CoreApiResponse.error(
        error.code,
        error.message,
        error.data,
      );
    }

    return errorResponse;
  }
}
