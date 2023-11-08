import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsString } from 'class-validator';
import { UseCaseValidatableAdapter } from '../../../../../../core/class-validator/ValidatableAdapter';
import { User } from '../../../entity/User';

export interface IUserUpdatePassBody {
  oldPass: string;
  newPass: string;
}

export interface IUserUpdatePassPayload extends IUserUpdatePassBody {
  user: User;
}

@Exclude()
export class UserUpdatePassPayload
  extends UseCaseValidatableAdapter
  implements IUserUpdatePassPayload
{
  @IsString()
  @Expose()
  public oldPass: string;

  @IsString()
  @Expose()
  public newPass: string;

  public user: User;

  public static async new(
    payload: IUserUpdatePassPayload,
  ): Promise<UserUpdatePassPayload> {
    const adapter = plainToInstance(UserUpdatePassPayload, payload);
    await adapter.validate();
    adapter.user = payload.user;
    return adapter;
  }
}
