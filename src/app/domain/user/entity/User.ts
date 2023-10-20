import { Entity } from '@core/entity/Entity';
import { RemovableEntity } from '@core/entity/RemovableEntity';
import { UserRole } from '@core/enums/UserEnums';
import { Nullable } from '@core/common/CommonTypes';
import { CreateUserEntityPayload } from './types/CreateUserEntityPayload';
import { EditUserEntityPayload } from './types/EditUserEntityPayload';
import { compare, genSalt, hash } from 'bcryptjs';
import { IsDate, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { v4 } from 'uuid';

export class User extends Entity<string> implements RemovableEntity {
  @IsEmail()
  private readonly email: string;

  @IsString()
  private password: string;

  @IsEnum(UserRole)
  private role: UserRole;

  @IsDate()
  private createdAt: Date;

  @IsDate()
  private editedAt: Date;

  @IsOptional()
  @IsDate()
  private birthday: Nullable<Date>;

  @IsOptional()
  @IsString()
  private firstName: Nullable<string>;

  @IsOptional()
  @IsString()
  private lastName: Nullable<string>;

  @IsOptional()
  @IsString()
  private intro: Nullable<string>;

  @IsOptional()
  @IsDate()
  private removedAt: Nullable<Date>;

  constructor(payload: CreateUserEntityPayload) {
    super();
    this.email = payload.email;
    this.password = payload.password;
    this.role = payload.role;
    this.id = payload.id || v4();
    this.createdAt = payload.createdAt || new Date();
    this.editedAt = payload.editedAt || this.createdAt;

    this.birthday = payload.birthday || null;
    this.firstName = payload.firstName || null;
    this.lastName = payload.lastName || null;
    this.intro = payload.intro || null;
    this.removedAt = payload.removedAt || null;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public getPassword(): string {
    return this.password;
  }

  public getBirthday(): Nullable<Date> {
    return this.birthday;
  }

  public getFirstName(): Nullable<string> {
    return this.firstName;
  }

  public getLastName(): Nullable<string> {
    return this.lastName;
  }

  public getName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public getIntro(): Nullable<string> {
    return this.intro;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getEditedAt(): Date {
    return this.editedAt;
  }

  public getRemovedAt(): Nullable<Date> {
    return this.removedAt;
  }

  public async hashPassword(): Promise<void> {
    const salt: string = await genSalt();
    this.password = await hash(this.password, salt);
  }

  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }

  public async editProfile(payload: EditUserEntityPayload): Promise<void> {
    const currentDate: Date = new Date();

    if (payload.firstName) {
      this.firstName = payload.firstName;
      this.editedAt = currentDate;
    }
    if (payload.lastName) {
      this.lastName = payload.lastName;
      this.editedAt = currentDate;
    }
    if (payload.birthday) {
      this.birthday = payload.birthday;
      this.editedAt = currentDate;
    }
    if (payload.intro) {
      this.intro = payload.intro;
      this.editedAt = currentDate;
    }

    await this.validate();
  }

  public async resetPassword(): Promise<string> {
    const newPsw = User.newPassword();
    this.password = newPsw;
    await this.hashPassword();
    return newPsw;
  }

  public async updatePassword(password: string): Promise<void> {
    this.password = password;
    await this.hashPassword();
  }

  public async remove(): Promise<void> {
    this.removedAt = new Date();
  }

  public async restore(): Promise<void> {
    this.removedAt = null;
  }

  public static async new(payload: CreateUserEntityPayload): Promise<User> {
    const user: User = new User(payload);
    await user.hashPassword();
    await user.validate();
    return user;
  }

  public static newPassword() {
    let psw = '';
    for (let i = 0; i < 6; i++)
      psw += Math.floor(Math.random() * 10).toString();
    return psw;
  }
}
