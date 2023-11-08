import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserInfoRes, UserInfoResData } from '../../dto/res/UserInfoRes';

export class UserEditProfileBody {
  @ApiPropertyOptional({ example: '2001-11-25' })
  birthday?: Date;

  @ApiPropertyOptional({ example: 'Dinh' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Chien' })
  lastName?: string;

  @ApiPropertyOptional({ example: 'hello the world' })
  intro?: string;
}

export class UserEditProfileResData extends UserInfoResData {
  @ApiProperty({ example: '2001-11-25' })
  public birthday?: Date;

  @ApiProperty({ example: 'hello the world' })
  public intro?: string;
}

export class UserEditProfileRes extends UserInfoRes {
  @ApiProperty({ example: 'Profile updated' })
  public message: string;

  @ApiProperty({ type: UserEditProfileResData })
  public data: UserEditProfileResData;
}
