import { Exclude, Expose, plainToInstance } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UseCaseValidatableAdapter } from '@core/class-validator/ValidatableAdapter';

export interface IUserLoginBody {
  email: string;
  password: string;
}
export interface IUserLoginPayload extends IUserLoginBody {}

@Exclude()
export class UserLoginPayload
  extends UseCaseValidatableAdapter
  implements IUserLoginPayload
{
  @IsEmail()
  @Expose()
  public email: string;

  @Matches(/^[a-zA-Z0-9#$@&%]*$/)
  @MaxLength(30)
  @MinLength(6)
  @IsString()
  @Expose()
  public password: string;

  public static async new(payload: IUserLoginPayload) {
    const adapter: UserLoginPayload = plainToInstance(
      UserLoginPayload,
      payload,
    );
    await adapter.validate();
    return adapter;
  }
}
