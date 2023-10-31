import { Injectable, Inject } from '@nestjs/common';
import { Nullable, Optional } from '@core/common/CommonTypes';
import { InfraDITokens } from '../../InfraDITokens';
import { Key } from '../../../domain/user/entity/Key';
import { TypeOrmKeyMapper } from '../entity/mapper/TypeOrmKeyMapper';
import { TypeOrmKey } from '../entity/TypeOrmKey';
import {
  Repository,
  SelectQueryBuilder,
  DataSource,
  TypeORMError,
} from 'typeorm';
import { IKeyRepository } from './interface/IKeyRepository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class TypeOrmKeyRepository
  extends Repository<TypeOrmKey>
  implements IKeyRepository
{
  constructor(
    @Inject(InfraDITokens.DataSource)
    private readonly dataSource: DataSource,
  ) {
    super(
      TypeOrmKey,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }

  private readonly keyAlias: string = 'key';

  public async getOne(by: {
    user_id?: string;
    email?: string;
    accessKey?: string;
    refreshKey?: string;
  }): Promise<Optional<Key>> {
    let domainEntity: Optional<Key>;

    const query: SelectQueryBuilder<TypeOrmKey> = this.selectKeyQueryBuilder();

    this.extendQueryWithByProperties(by, query);

    const ormEntity: Nullable<TypeOrmKey> = await query.getOne();

    if (ormEntity) {
      domainEntity = TypeOrmKeyMapper.toDomainEntity(ormEntity);
    }

    return domainEntity;
  }

  @Transactional()
  public async deleteOne(by: {
    email?: string;
    user_id?: string;
  }): Promise<void> {
    const where: { email?: string; user_id?: string } = {};
    if (by.email) where.email = by.email;
    if (by.user_id) where.user_id = by.user_id;

    await this.delete(where);
  }

  @Transactional()
  public async createOne(key: Key): Promise<void> {
    const ormKey: TypeOrmKey = TypeOrmKeyMapper.toOrmEntity(key);

    await this.createQueryBuilder(this.keyAlias)
      .insert()
      .into(TypeOrmKey)
      .values([ormKey])
      .execute();
  }

  @Transactional()
  public async updateOne(key: Key): Promise<void> {
    const ormKey: TypeOrmKey = TypeOrmKeyMapper.toOrmEntity(key);
    await this.update(ormKey.user_id, ormKey);
  }

  @Transactional()
  public async upsertOne(key: Key): Promise<void> {
    const ormKey: TypeOrmKey = TypeOrmKeyMapper.toOrmEntity(key);
    await this.upsert(ormKey, ['user_id']);
  }

  private selectKeyQueryBuilder(): SelectQueryBuilder<TypeOrmKey> {
    return this.createQueryBuilder(this.keyAlias).select();
  }

  private extendQueryWithByProperties(
    by: {
      user_id?: string;
      email?: string;
      accessKey?: string;
      refreshKey?: string;
    },
    query: SelectQueryBuilder<TypeOrmKey>,
  ): void {
    if (by.user_id) {
      query.andWhere('`user_id` = :user_id', { user_id: by.user_id });
    }
    if (by.email) {
      query.andWhere('`email` = :email', { email: by.email });
    }
    if (by.accessKey) {
      query.andWhere('`accessKey` = :accessKey', { accessKey: by.accessKey });
    }
    if (by.refreshKey) {
      query.andWhere('`refreshKey` = :refreshKey', {
        refreshKey: by.refreshKey,
      });
    }
  }
}
