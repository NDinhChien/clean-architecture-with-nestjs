import {
  RepositoryFindOptions,
  RepositoryRemoveOptions,
} from '@core/RepositoryOptions';
import { Optional } from '@core/common/CommonTypes';
import { User } from '@app/domain/user/entity/User';

export interface IUserRepository {
  createOne(user: User): Promise<void>;
  deleteOne(user: User, options?: RepositoryRemoveOptions): Promise<void>;
  updateOne(user: User): Promise<void>;
  getOne(
    by: { email?: string; id?: string },
    options?: RepositoryFindOptions,
  ): Promise<Optional<User>>;
  getMany(options: RepositoryFindOptions): Promise<User[]>;
}
