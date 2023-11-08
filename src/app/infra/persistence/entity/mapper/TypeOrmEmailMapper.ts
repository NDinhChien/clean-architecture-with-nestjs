import { Email } from '../../../../domain/user/entity/Email';
import { TypeOrmEmail } from '../TypeOrmEmail';

export class TypeOrmEmailMapper {
  public static toOrmEntity(email: Email): TypeOrmEmail {
    const ormEmail: TypeOrmEmail = new TypeOrmEmail();
    ormEmail.email = email.getEmail();
    ormEmail.code = email.getCode();
    ormEmail.issuedAt = email.getIssuedAt();

    ormEmail.verified = email.getVerified();
    ormEmail.triedTimes = email.getTriedTimes();
    ormEmail.refreshedTimes = email.getRefreshedTimes();

    ormEmail.lastTryAt = email.getLastTryAt();
    return ormEmail;
  }

  public static toOrmEntities(emails: Email[]): TypeOrmEmail[] {
    return emails.map((email) => this.toOrmEntity(email));
  }

  public static toDomainEntity(ormEmail: TypeOrmEmail): Email {
    const email: Email = new Email({
      email: ormEmail.email,
      code: ormEmail.code,
      issuedAt: ormEmail.issuedAt,

      verified: ormEmail.verified,
      triedTimes: ormEmail.triedTimes,
      refreshedTimes: ormEmail.refreshedTimes,

      lastTryAt: ormEmail.lastTryAt || undefined,
    });

    return email;
  }

  public static toDomainEntities(ormEmails: TypeOrmEmail[]): Email[] {
    return ormEmails.map((ormEmail) => this.toDomainEntity(ormEmail));
  }
}
