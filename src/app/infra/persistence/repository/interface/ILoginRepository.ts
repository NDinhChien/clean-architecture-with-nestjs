import { Optional } from '../../../../../core/common/CommonTypes';
import { Login } from '../../../../domain/user/entity/login/Login';

export interface ILoginRepository {
  getOne(by: { email: string }): Promise<Optional<Login>>;
  createOne(login: Login): Promise<void>;
  updateOne(login: Login): Promise<void>;
  deleteOne(by: { email: string }): Promise<void>;
}
