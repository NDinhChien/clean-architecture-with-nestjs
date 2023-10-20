import { Exclude, Expose, plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsBooleanString,
  IsNumber,
  IsNumberString,
} from 'class-validator';
import { UseCaseValidatableAdapter } from '../../../../../../core/class-validator/ValidatableAdapter';

export interface IAdminGetUserListQuery {
  offset: number;
  limit: number;
  includeRemoved: boolean;
}

export interface IAdminGetUserListPayload extends IAdminGetUserListQuery {}

@Exclude()
export class AdminGetUserListPayload
  extends UseCaseValidatableAdapter
  implements IAdminGetUserListPayload
{
  @IsNumberString()
  @Expose()
  public offset: number;

  @IsNumberString()
  @Expose()
  public limit: number;

  @IsBooleanString()
  @Expose()
  public includeRemoved: boolean;

  public static async new(
    payload: IAdminGetUserListPayload,
  ): Promise<AdminGetUserListPayload> {
    const adapter = plainToInstance(AdminGetUserListPayload, payload);
    await adapter.validate();
    adapter.offset = parseInt(adapter.offset as unknown as string);
    adapter.limit = parseInt(adapter.limit as unknown as string);
    adapter.includeRemoved =
      (adapter.limit as unknown as string) === 'true' ? true : false;
    return adapter;
  }
}
