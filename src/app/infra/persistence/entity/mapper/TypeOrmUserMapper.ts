import { User } from '@app/domain/user/entity/User';
import { TypeOrmUser } from '../TypeOrmUser';

export class TypeOrmUserMapper {
  public static toOrmEntity(user: User): TypeOrmUser {
    const ormUser: TypeOrmUser = new TypeOrmUser();

    ormUser.email = user.getEmail();
    ormUser.role = user.getRole();
    ormUser.password = user.getPassword();
    ormUser.id = user.getId();
    ormUser.createdAt = user.getCreatedAt();
    ormUser.editedAt = user.getEditedAt();

    ormUser.firstName = user.getFirstName();
    ormUser.lastName = user.getLastName();
    ormUser.birthday = user.getBirthday();
    ormUser.intro = user.getIntro();
    ormUser.removedAt = user.getRemovedAt();
    return ormUser;
  }

  public static toOrmEntities(users: User[]): TypeOrmUser[] {
    return users.map((user) => this.toOrmEntity(user));
  }

  public static toDomainEntity(ormUser: TypeOrmUser): User {
    const user: User = new User({
      email: ormUser.email,
      role: ormUser.role,
      password: ormUser.password,
      id: ormUser.id,
      createdAt: ormUser.createdAt,
      editedAt: ormUser.editedAt,

      firstName: ormUser.firstName || undefined,
      lastName: ormUser.lastName || undefined,
      birthday: ormUser.birthday || undefined,
      intro: ormUser.intro || undefined,
      removedAt: ormUser.removedAt || undefined,
    });

    return user;
  }

  public static toDomainEntities(ormUsers: TypeOrmUser[]): User[] {
    return ormUsers.map((ormUser) => this.toDomainEntity(ormUser));
  }
}
