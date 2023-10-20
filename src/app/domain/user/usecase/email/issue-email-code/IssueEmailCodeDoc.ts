import { HttpRestApiResponse } from '@core/documentation/HttpRestApiResponse';
import { IIssueEmailCodeBody } from './IssueEmailCodePayload';
import { ApiProperty } from '@nestjs/swagger';

export class IssueEmailCodeBody implements IIssueEmailCodeBody {
  @ApiProperty({ type: 'string', example: 'dinhchien25112001@gmail.com' })
  public email: string;
}

export class IssueEmailCodeRes extends HttpRestApiResponse {
  @ApiProperty({ type: 'string', example: 'Email code issued.' })
  public message: string;
}
