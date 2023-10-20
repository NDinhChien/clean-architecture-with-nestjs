import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { UseCaseValidatableAdapter } from '../../../../../../core/class-validator/ValidatableAdapter';
import { IsDefined, IsEmail } from 'class-validator';
import { User } from '../../../entity/User';

export interface IUserResetPasswordBody {
  email: string;
}

export interface IUserResetPasswordPayload extends IUserResetPasswordBody {}

@Exclude()
export class UserResetPasswordPayload
  extends UseCaseValidatableAdapter
  implements IUserResetPasswordPayload
{
  @IsEmail()
  @Expose()
  public email: string;

  public static async new(
    payload: IUserResetPasswordPayload,
  ): Promise<UserResetPasswordPayload> {
    const adapter = plainToInstance(UserResetPasswordPayload, payload);
    await adapter.validate();
    return adapter;
  }
}
