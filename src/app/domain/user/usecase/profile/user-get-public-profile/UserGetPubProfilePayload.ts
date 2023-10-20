import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { UseCaseValidatableAdapter } from '@core/class-validator/ValidatableAdapter';

export interface IUserIdParam {
  id: string;
}

export interface IUserGetPubProfilePayload extends IUserIdParam {}

@Exclude()
export class UserGetPubProfilePayload
  extends UseCaseValidatableAdapter
  implements IUserGetPubProfilePayload
{
  @IsUUID()
  @Expose()
  public id: string;

  public static async new(
    payload: IUserGetPubProfilePayload,
  ): Promise<UserGetPubProfilePayload> {
    const adapter = plainToInstance(UserGetPubProfilePayload, payload);
    await adapter.validate();
    return adapter;
  }
}
