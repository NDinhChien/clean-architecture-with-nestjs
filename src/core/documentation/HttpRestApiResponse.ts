import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiResponse {
  @ApiProperty({ type: 'number', example: '200' })
  public code: number;

  @ApiProperty({ type: 'string' })
  public message: string;

  @ApiProperty({ description: 'timestamp in ms', type: 'number' })
  public timestamp: number;
}
