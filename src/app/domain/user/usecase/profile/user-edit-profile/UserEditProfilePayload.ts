import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { UseCaseValidatableAdapter } from '../../../../../../core/class-validator/ValidatableAdapter';
import { IsDateString, IsDefined, IsOptional, IsString } from 'class-validator';
import { User } from '../../../entity/User';

export interface IUserEditProfileBody {
  birthday?: Date;
  firstName?: string;
  lastName?: string;
  intro?: string;
}

export interface IUserEditProfilePayload extends IUserEditProfileBody {
  user: User;
}

@Exclude()
export class UserEditProfilePayload
  extends UseCaseValidatableAdapter
  implements IUserEditProfilePayload
{
  @IsOptional()
  @IsDateString()
  @Expose()
  public birthday?: Date;

  @IsOptional()
  @IsString()
  @Expose()
  public firstName?: string;

  @IsOptional()
  @IsString()
  @Expose()
  public lastName?: string;

  @IsOptional()
  @IsString()
  @Expose()
  public intro?: string;

  public user: User;

  public static async new(
    payload: IUserEditProfilePayload,
  ): Promise<UserEditProfilePayload> {
    const adapter = plainToInstance(UserEditProfilePayload, payload);
    await adapter.validate();
    adapter.birthday = new Date(adapter.birthday as unknown as string);
    adapter.user = payload.user;
    return adapter;
  }
}
