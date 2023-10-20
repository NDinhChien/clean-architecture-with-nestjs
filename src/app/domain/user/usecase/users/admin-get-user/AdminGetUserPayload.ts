import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { UseCaseValidatableAdapter } from '@core/class-validator/ValidatableAdapter';

export interface IUserIdParam {
  id: string;
}

export interface IAdminGetUserPayload extends IUserIdParam {}

@Exclude()
export class AdminGetUserPayload
  extends UseCaseValidatableAdapter
  implements IAdminGetUserPayload
{
  @IsUUID()
  @Expose()
  public id: string;

  public static async new(
    payload: IAdminGetUserPayload,
  ): Promise<AdminGetUserPayload> {
    const adapter = plainToInstance(AdminGetUserPayload, payload);
    await adapter.validate();
    return adapter;
  }
}
