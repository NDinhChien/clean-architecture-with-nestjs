import { User } from '../../entity/User';
import { Exclude, Expose } from 'class-transformer';
import { UserPublicInfoDto } from './UserPublicInfoDto';
import { plainToDto } from '@core/class-transformer/plainToDto';

@Exclude()
export class UserInfoDto extends UserPublicInfoDto {
  @Expose()
  public email: string;

  public static newFromUser(user: User): UserInfoDto {
    return plainToDto(UserInfoDto, user);
  }

  public static newListFromUsers(users: User[]): UserInfoDto[] {
    return users.map((user) => this.newFromUser(user));
  }
}
