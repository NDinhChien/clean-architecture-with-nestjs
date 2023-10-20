import { EntityValidatableAdapter } from '../class-validator/ValidatableAdapter';

export class Entity<
  TIdentifier extends string | number,
> extends EntityValidatableAdapter {
  protected id: TIdentifier;

  public getId(): TIdentifier {
    return this.id;
  }
}
