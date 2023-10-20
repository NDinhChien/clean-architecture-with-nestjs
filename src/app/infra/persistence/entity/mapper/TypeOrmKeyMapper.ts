import { Key } from '@app/domain/user/entity/key/Key';
import { TypeOrmKey } from '../TypeOrmKey';

export class TypeOrmKeyMapper {
  public static toOrmEntity(key: Key): TypeOrmKey {
    const ormKey: TypeOrmKey = new TypeOrmKey();

    ormKey.user_id = key.getUserId();
    ormKey.email = key.getEmail();
    ormKey.accessKey = key.getAccessKey();
    ormKey.refreshKey = key.getRefreshKey();

    return ormKey;
  }

  public static toOrmEntities(keys: Key[]): TypeOrmKey[] {
    return keys.map((key) => this.toOrmEntity(key));
  }

  public static toDomainEntity(ormKey: TypeOrmKey): Key {
    const key: Key = new Key({
      user_id: ormKey.user_id,
      email: ormKey.email,
      accessKey: ormKey.accessKey,
      refreshKey: ormKey.refreshKey,
    });

    return key;
  }

  public static toDomainEntities(ormKeys: TypeOrmKey[]): Key[] {
    return ormKeys.map((ormKey) => this.toDomainEntity(ormKey));
  }
}
