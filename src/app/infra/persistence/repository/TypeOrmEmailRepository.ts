import { Injectable, Inject } from '@nestjs/common';
import { RepositoryFindOptions } from '@core/RepositoryOptions';
import { Nullable, Optional } from '@core/common/CommonTypes';
import { InfraDITokens } from '../../InfraDITokens';
import { Email } from '@app/domain/user/entity/email/Email';
import { TypeOrmEmailMapper } from '../entity/mapper/TypeOrmEmailMapper';
import { TypeOrmEmail } from '../entity/TypeOrmEmail';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { IEmailRepository } from './interface/IEmailRepository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class TypeOrmEmailRepository
  extends Repository<TypeOrmEmail>
  implements IEmailRepository
{
  constructor(
    @Inject(InfraDITokens.DataSource)
    private readonly dataSource: DataSource,
  ) {
    super(
      TypeOrmEmail,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }

  private readonly emailAlias: string = 'email';

  public async getOne(
    by: { email: string },
    options: RepositoryFindOptions = {},
  ): Promise<Optional<Email>> {
    let domainEntity: Optional<Email>;

    const query: SelectQueryBuilder<TypeOrmEmail> =
      this.selectEmailQueryBuilder();

    this.extendQueryWithByProperties(by, query);

    const ormEntity: Nullable<TypeOrmEmail> = await query.getOne();

    if (ormEntity) {
      domainEntity = TypeOrmEmailMapper.toDomainEntity(ormEntity);
    }

    return domainEntity;
  }

  @Transactional()
  public async deleteOne(email: Email): Promise<void> {
    const ormEmail: TypeOrmEmail = TypeOrmEmailMapper.toOrmEntity(email);
    await this.remove(ormEmail);
  }

  @Transactional()
  public async createOne(email: Email): Promise<void> {
    const ormEmail: TypeOrmEmail = TypeOrmEmailMapper.toOrmEntity(email);

    await this.createQueryBuilder(this.emailAlias)
      .insert()
      .into(TypeOrmEmail)
      .values([ormEmail])
      .execute();
  }

  @Transactional()
  public async updateOne(email: Email): Promise<void> {
    const ormEmail: TypeOrmEmail = TypeOrmEmailMapper.toOrmEntity(email);
    await this.update(ormEmail.email, ormEmail);
  }

  private selectEmailQueryBuilder(): SelectQueryBuilder<TypeOrmEmail> {
    return this.createQueryBuilder(this.emailAlias).select();
  }

  private extendQueryWithByProperties(
    by: { email: string },
    query: SelectQueryBuilder<TypeOrmEmail>,
  ): void {
    if (by.email) {
      query.andWhere('`email` = :email', { email: by.email });
    }
  }
}
