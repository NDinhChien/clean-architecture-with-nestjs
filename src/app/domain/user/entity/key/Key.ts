import { CreateKeyEntityPayload } from './types/CreateKeyEntityPayload';
import { randomBytes } from 'crypto';
import { IsEmail, IsString, IsUUID } from 'class-validator';
import { EntityValidatableAdapter } from '../../../../../core/class-validator/ValidatableAdapter';

export class Key extends EntityValidatableAdapter {
  @IsUUID()
  private readonly user_id: string;

  @IsEmail()
  private readonly email: string;

  @IsString()
  private accessKey: string;

  @IsString()
  private refreshKey: string;

  constructor(payload: CreateKeyEntityPayload) {
    super();
    this.user_id = payload.user_id;
    this.email = payload.email;
    this.accessKey = payload.accessKey || Key.newKeyString();
    this.refreshKey = payload.refreshKey || Key.newKeyString();
  }

  public getUserId() {
    return this.user_id;
  }

  public getEmail() {
    return this.email;
  }

  public getAccessKey() {
    return this.accessKey;
  }

  public getRefreshKey() {
    return this.refreshKey;
  }

  public async updateKeyString() {
    this.accessKey = Key.newKeyString();
    this.refreshKey = Key.newKeyString();
  }

  public static async new(payload: CreateKeyEntityPayload) {
    const key = new Key(payload);
    await key.validate();
    return key;
  }
  public static newKeyString() {
    return randomBytes(64).toString();
  }
}
