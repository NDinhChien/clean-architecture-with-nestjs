import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { UseCaseValidatableAdapter } from '@core/class-validator/ValidatableAdapter';

export interface IUserSignUpBody {
  email: string;
  password: string;
}
export interface IUserSignUpPayload extends IUserSignUpBody {}

@Exclude()
export class UserSignUpPayload
  extends UseCaseValidatableAdapter
  implements IUserSignUpPayload
{
  @IsEmail()
  @Expose()
  public email: string;

  @IsString()
  @Expose()
  public password: string;

  public static async new(payload: IUserSignUpPayload) {
    const adapter: UserSignUpPayload = plainToInstance(
      UserSignUpPayload,
      payload,
    );
    await adapter.validate();
    return adapter;
  }
}
