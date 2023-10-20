import { User } from '../../entity/User';
import { Expose, Exclude } from 'class-transformer';
import { UserRole } from '@core/enums/UserEnums';
import { plainToDto } from '@core/class-transformer/plainToDto';

@Exclude()
export class UserPublicInfoDto {
  @Expose()
  public id: string;

  @Expose()
  public role: UserRole;

  @Expose()
  public firstName?: string;

  @Expose()
  public lastName?: string;

  @Expose()
  public birthday?: Date;

  @Expose()
  public intro?: string;

  public static newFromUser(user: User): UserPublicInfoDto {
    return plainToDto(UserPublicInfoDto, user);
  }

  public static newListFromUsers(users: User[]): UserPublicInfoDto[] {
    return users.map((user) => this.newFromUser(user));
  }
}
