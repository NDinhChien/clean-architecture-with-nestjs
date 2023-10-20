import { Login } from '@app/domain/user/entity/login/Login';
import { TypeOrmLogin } from '../TypeOrmLogin';

export class TypeOrmLoginMapper {
  public static toOrmEntity(login: Login): TypeOrmLogin {
    const ormLogin: TypeOrmLogin = new TypeOrmLogin();

    ormLogin.email = login.getEmail();
    ormLogin.triedTimes = login.getTriedTimes();
    ormLogin.lastTryAt = login.getLastTryAt();

    return ormLogin;
  }

  public static toOrmEntities(logins: Login[]): TypeOrmLogin[] {
    return logins.map((login) => this.toOrmEntity(login));
  }

  public static toDomainEntity(ormLogin: TypeOrmLogin): Login {
    const login: Login = new Login({
      email: ormLogin.email,
      triedTimes: ormLogin.triedTimes,
      lastTryAt: ormLogin.lastTryAt,
    });

    return login;
  }

  public static toDomainEntities(ormLogins: TypeOrmLogin[]): Login[] {
    return ormLogins.map((ormLogin) => this.toDomainEntity(ormLogin));
  }
}
