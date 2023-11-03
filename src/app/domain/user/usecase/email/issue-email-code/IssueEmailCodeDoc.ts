import { HttpRestApiResponse } from '@core/documentation/HttpRestApiResponse';
import { IIssueEmailCodeBody } from './IssueEmailCodePayload';
import { ApiProperty } from '@nestjs/swagger';

export class IssueEmailCodeBody implements IIssueEmailCodeBody {
  @ApiProperty({ example: 'test@gmail.com' })
  public email: string;
}

export class IssueEmailCodeRes extends HttpRestApiResponse {
  @ApiProperty({ example: 'Email code issued.' })
  public message: string;
}
