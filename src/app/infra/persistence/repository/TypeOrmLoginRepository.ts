import { Injectable, Inject } from '@nestjs/common';
import { Nullable, Optional } from '@core/common/CommonTypes';
import { InfraDITokens } from '../../InfraDITokens';
import { Login } from '@app/domain/user/entity/login/Login';
import { TypeOrmLoginMapper } from '../entity/mapper/TypeOrmLoginMapper';
import { TypeOrmLogin } from '../entity/TypeOrmLogin';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { ILoginRepository } from './interface/ILoginRepository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class TypeOrmLoginRepository
  extends Repository<TypeOrmLogin>
  implements ILoginRepository
{
  constructor(
    @Inject(InfraDITokens.DataSource)
    private readonly dataSource: DataSource,
  ) {
    super(
      TypeOrmLogin,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }

  private readonly loginAlias: string = 'login';

  public async getOne(by: { email: string }): Promise<Optional<Login>> {
    let domainEntity: Optional<Login>;

    const query: SelectQueryBuilder<TypeOrmLogin> =
      this.selectLoginQueryBuilder();

    this.extendQueryWithByProperties(by, query);

    const ormEntity: Nullable<TypeOrmLogin> = await query.getOne();

    if (ormEntity) {
      domainEntity = TypeOrmLoginMapper.toDomainEntity(ormEntity);
    }

    return domainEntity;
  }
  @Transactional()
  public async deleteOne(by: { email: string }): Promise<void> {
    if (by.email) {
      await this.delete({ email: by.email });
    }
  }

  @Transactional()
  public async createOne(login: Login): Promise<void> {
    const ormLogin: TypeOrmLogin = TypeOrmLoginMapper.toOrmEntity(login);

    await this.createQueryBuilder(this.loginAlias)
      .insert()
      .into(TypeOrmLogin)
      .values([ormLogin])
      .execute();
  }

  @Transactional()
  public async updateOne(login: Login): Promise<void> {
    const ormLogin: TypeOrmLogin = TypeOrmLoginMapper.toOrmEntity(login);
    await this.update(ormLogin.email, ormLogin);
  }

  private selectLoginQueryBuilder(): SelectQueryBuilder<TypeOrmLogin> {
    return this.createQueryBuilder(this.loginAlias).select();
  }

  private extendQueryWithByProperties(
    by: { email: string },
    query: SelectQueryBuilder<TypeOrmLogin>,
  ): void {
    if (by.email) {
      query.andWhere('`email` = :email', { email: by.email });
    }
  }
}
