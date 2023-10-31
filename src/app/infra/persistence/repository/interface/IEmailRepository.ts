import { Optional } from '@core/common/CommonTypes';
import { Email } from '../../../../domain/user/entity/Email';

export interface IEmailRepository {
  getOne(by: { email: string }): Promise<Optional<Email>>;
  createOne(email: Email): Promise<void>;
  updateOne(email: Email): Promise<void>;
  deleteOne(email: Email): Promise<void>;
}
