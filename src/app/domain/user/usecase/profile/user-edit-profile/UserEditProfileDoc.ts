import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserInfoRes, UserInfoResData } from '../../dto/res/UserInfoRes';

export class UserEditProfileBody {
  @ApiPropertyOptional({ type: Date, example: '2001-11-25' })
  birthday?: Date;

  @ApiPropertyOptional({ type: 'string' })
  firstName?: string;

  @ApiPropertyOptional({ type: 'string' })
  lastName?: string;

  @ApiPropertyOptional({ type: 'string', example: 'hello the world' })
  intro?: string;
}

export class UserEditProfileResData extends UserInfoResData {
  @ApiProperty({ type: 'date', example: '2001-11-25T00:00:00.000Z' })
  public birthday?: Date;

  @ApiProperty({ type: 'string', example: 'hello the world' })
  public intro?: string;
}

export class UserEditProfileRes extends UserInfoRes {
  @ApiProperty({ type: 'string', example: 'Profile updated' })
  public message: string;

  @ApiProperty({ type: UserEditProfileResData })
  public data: UserEditProfileResData;
}
