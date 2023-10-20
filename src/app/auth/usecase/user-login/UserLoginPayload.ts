import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsDefined, IsEmail, IsString, Matches, MaxLength, Min, MinLength, maxLength, minLength } from 'class-validator';
import { UseCaseValidatableAdapter } from '@core/class-validator/ValidatableAdapter';

/*---------------Interface----------------*/
export interface IUserLoginBody {
  email: string;
  password: string;
}
export interface IUserLoginPayload extends IUserLoginBody {}

/*------------UseCase Payload-------------*/
@Exclude()
export class UserLoginPayload
  extends UseCaseValidatableAdapter
  implements IUserLoginPayload
{
  @IsEmail()
  @Expose()
  public email: string;

  
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9#$@&%]*$/)
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
