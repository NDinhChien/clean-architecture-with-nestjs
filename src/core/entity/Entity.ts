import { IsDefined } from 'class-validator';
import { EntityValidatableAdapter } from '../class-validator/ValidatableAdapter';

export class Entity<
  TIdentifier extends string | number,
> extends EntityValidatableAdapter {
  @IsDefined()
  protected id: TIdentifier;

  public getId(): TIdentifier {
    return this.id;
  }
}
