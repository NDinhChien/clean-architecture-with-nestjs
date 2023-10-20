import { Injectable, Inject } from '@nestjs/common';
import { User } from '@app/domain/user/entity/User';
import { TypeOrmUser } from '../entity/TypeOrmUser';
import { TypeOrmUserMapper } from '../entity/mapper/TypeOrmUserMapper';
import { IUserRepository } from './interface/IUserRepository';
import { SelectQueryBuilder, DataSource, Repository } from 'typeorm';
import {
  RepositoryFindOptions,
  RepositoryRemoveOptions,
} from '@core/RepositoryOptions';
import { Nullable, Optional } from '@core/common/CommonTypes';
import { InfraDITokens } from '../../InfraDITokens';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class TypeOrmUserRepository
  extends Repository<TypeOrmUser>
  implements IUserRepository
{
  constructor(
    @Inject(InfraDITokens.DataSource)
    private readonly dataSource: DataSource,
  ) {
    super(
      TypeOrmUser,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }

  private readonly userAlias: string = 'user';

  private readonly excludeRemovedUserClause: string = '`removedAt` IS NULL';

  public async getOne(
    by: { id?: string; email?: string },
    options: RepositoryFindOptions = {},
  ): Promise<Optional<User>> {
    let domainEntity: Optional<User>;

    const query: SelectQueryBuilder<TypeOrmUser> =
      this.selectUserQueryBuilder();

    this.extendQueryWithByProperties(by, query);

    if (!options.includeRemoved) {
      query.andWhere(this.excludeRemovedUserClause);
    }

    const ormEntity: Nullable<TypeOrmUser> = await query.getOne();

    if (ormEntity) {
      domainEntity = TypeOrmUserMapper.toDomainEntity(ormEntity);
    }

    return domainEntity;
  }

  @Transactional()
  public async deleteOne(
    user: User,
    options: RepositoryRemoveOptions,
  ): Promise<void> {
    await user.remove();
    const ormUser: TypeOrmUser = TypeOrmUserMapper.toOrmEntity(user);

    if (!options.softDeleting) {
      await this.remove(ormUser);
    }
    if (options.softDeleting) {
      await this.update(ormUser.id, ormUser);
    }
  }

  public async getMany(options: RepositoryFindOptions): Promise<User[]> {
    let domainEntities: User[] = [];

    const query: SelectQueryBuilder<TypeOrmUser> =
      this.selectUserQueryBuilder();

    if (!options.includeRemoved) {
      query.andWhere(this.excludeRemovedUserClause);
    }
    query.orderBy('`id`', 'ASC');
    if (options.limit) {
      query.take(options.limit);
    }
    if (options.offset) {
      query.skip(options.offset);
    }

    const ormEntities: TypeOrmUser[] = await query.getMany();

    if (ormEntities) {
      domainEntities = TypeOrmUserMapper.toDomainEntities(ormEntities);
    }

    return domainEntities;
  }

  @Transactional()
  public async createOne(user: User): Promise<void> {
    const ormUser: TypeOrmUser = TypeOrmUserMapper.toOrmEntity(user);

    await this.createQueryBuilder(this.userAlias)
      .insert()
      .into(TypeOrmUser)
      .values([ormUser])
      .execute();
  }

  @Transactional()
  public async updateOne(user: User): Promise<void> {
    const ormUser: TypeOrmUser = TypeOrmUserMapper.toOrmEntity(user);
    await this.update(ormUser.id, ormUser);
  }

  private selectUserQueryBuilder(): SelectQueryBuilder<TypeOrmUser> {
    return this.createQueryBuilder(this.userAlias).select();
  }

  private extendQueryWithByProperties(
    by: { id?: string; email?: string },
    query: SelectQueryBuilder<TypeOrmUser>,
  ): void {
    if (by.id) {
      query.andWhere('`id` = :id', { id: by.id });
    }
    if (by.email) {
      query.andWhere('`email` = :email', { email: by.email });
    }
  }
}
