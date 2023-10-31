import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';
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
  @IsNumber()
  @Transform(({value}) => Number(value))
  @Expose()
  public offset: number;

  @IsNumber()
  @Transform(({value}) => Number(value))
  @Expose()
  public limit: number;

  @IsBoolean()
  @Transform(({value}) => Boolean(value))
  @Expose()
  public includeRemoved: boolean;

  public static async new(
    payload: IAdminGetUserListPayload,
  ): Promise<AdminGetUserListPayload> {
    const adapter = plainToInstance(AdminGetUserListPayload, payload);
    await adapter.validate();

    return adapter;
  }
}
