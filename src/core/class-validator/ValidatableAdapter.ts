import { Code } from '../common/Code';
import { Exception } from '../Exception';
import { Optional } from '../common/CommonTypes';
import {
  ClassValidationDetails,
  ClassValidator,
} from '../class-validator/ClassValidator';

export class EntityValidatableAdapter {
  public async validate(): Promise<void> {
    const details: Optional<ClassValidationDetails> =
      await ClassValidator.validate(this);
    if (details) {
      throw Exception.new({
        code: Code.ENTITY_VALIDATION_ERROR,
        data: details,
      });
    }
  }
}

export class UseCaseValidatableAdapter {
  public async validate(): Promise<void> {
    const details: Optional<ClassValidationDetails> =
      await ClassValidator.validate(this);
    if (details) {
      throw Exception.new({
        code: Code.USE_CASE_VALIDATION_ERROR,
        data: details,
      });
    }
  }
}

export class ObjectValidatableAdapter {
  public async validate(): Promise<void> {
    const details: Optional<ClassValidationDetails> =
      await ClassValidator.validate(this);
    if (details) {
      throw Exception.new({
        code: Code.OBJECT_VALIDATION_ERROR,
        data: details,
      });
    }
  }
}
