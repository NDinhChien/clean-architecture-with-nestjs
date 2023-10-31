import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsString } from 'class-validator';
import { UseCaseValidatableAdapter } from '@core/class-validator/ValidatableAdapter';

export interface IUserRefreshTokenBody {
  refreshToken: string;
}

export interface IUserRefreshTokenPayload extends IUserRefreshTokenBody {
  accessToken: string;
}

@Exclude()
export class UserRefreshTokenPayload
  extends UseCaseValidatableAdapter
  implements IUserRefreshTokenPayload
{
  @Expose()
  @IsString()
  accessToken: string;

  @Expose()
  @IsString()
  refreshToken: string;

  public static async new(payload: IUserRefreshTokenPayload) {
    const adapter: UserRefreshTokenPayload = plainToInstance(
      UserRefreshTokenPayload,
      payload,
    );
    await adapter.validate();
    return adapter;
  }
}
