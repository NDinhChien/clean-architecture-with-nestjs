import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsEmail, IsUUID } from 'class-validator';
import { UseCaseValidatableAdapter } from '@core/class-validator/ValidatableAdapter';

/*---------------Interface----------------*/
export interface IUserLogoutPayload {
  id: string;
  email: string;
}

/*------------UseCase Payload-------------*/
@Exclude()
export class UserLogoutPayload
  extends UseCaseValidatableAdapter
  implements IUserLogoutPayload
{
  @IsUUID()
  @Expose()
  public id: string;

  @IsEmail()
  @Expose()
  public email: string;
  
  public static async new(payload: IUserLogoutPayload) {
    const adapter: UserLogoutPayload = plainToInstance(
      UserLogoutPayload,
      payload,
    );
    await adapter.validate();
    return adapter;
  }
}
