import { Optional } from '../../../../../core/common/CommonTypes';
import { Key } from '../../../../domain/user/entity/key/Key';

export interface IKeyRepository {
  getOne(by: {
    email?: string;
    user_id?: string;
    accessKey?: string;
    refreshKey?: string;
  }): Promise<Optional<Key>>;
  deleteOne(by: { email?: string; user_id?: string }): Promise<void>;
  createOne(key: Key): Promise<void>;
  updateOne(key: Key): Promise<void>;
  upsertOne(key: Key): Promise<void>;
}
