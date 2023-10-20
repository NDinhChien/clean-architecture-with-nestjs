import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { UseCaseValidatableAdapter } from '../../../../../../core/class-validator/ValidatableAdapter';

export interface IUserVerifyEmailBody {
  email: string;
  code: string;
}

export interface IUserVerifyEmailPayload extends IUserVerifyEmailBody {}

@Exclude()
export class UserVerifyEmailPayload
  extends UseCaseValidatableAdapter
  implements IUserVerifyEmailPayload
{
  @IsEmail()
  @Expose()
  public email: string;

  @IsString()
  @Expose()
  public code: string;

  public static async new(
    payload: IUserVerifyEmailPayload,
  ): Promise<UserVerifyEmailPayload> {
    const adapter: UserVerifyEmailPayload = plainToInstance(
      UserVerifyEmailPayload,
      payload,
    );
    await adapter.validate();
    return adapter;
  }
}
