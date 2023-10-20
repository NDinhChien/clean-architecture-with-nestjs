import { EntityValidatableAdapter } from '@core/class-validator/ValidatableAdapter';
import { Nullable } from '@core/common/CommonTypes';
import { CreateEmailEntityPayload } from './types/CreateEmailEntityPayload';
import { Rule } from '../../../../../config/RuleConfig';
import { Exception } from '@core/Exception';
import { Code } from '@core/common/Code';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class Email extends EntityValidatableAdapter {
  @IsEmail()
  private readonly email: string;

  @IsString()
  private code: string;

  @IsDate()
  private issuedAt: Date;

  @IsOptional()
  @IsDate()
  private lastTryAt: Nullable<Date>;

  @IsBoolean()
  private verified: boolean;

  @IsNumber()
  private triedTimes: number;

  @IsNumber()
  private refreshedTimes: number;

  constructor(payload: CreateEmailEntityPayload) {
    super();
    this.email = payload.email;
    this.code = payload.code || Email.newEmailCode();
    this.issuedAt = payload.issuedAt || new Date();

    this.verified = payload.verified || false;
    this.triedTimes = payload.triedTimes || 0;
    this.refreshedTimes = payload.refreshedTimes || 0;

    this.lastTryAt = payload.lastTryAt || null;
  }

  public getEmail() {
    return this.email;
  }
  public getCode() {
    return this.code;
  }
  public getIssuedAt() {
    return this.issuedAt;
  }
  public getLastTryAt() {
    return this.lastTryAt;
  }
  public getVerified() {
    return this.verified;
  }
  public getTriedTimes() {
    return this.triedTimes;
  }
  public getRefreshedTimes() {
    return this.refreshedTimes;
  }
  public setVerified(verified: boolean) {
    this.verified = verified;
  }

  public increaseTriedTimes() {
    if (this.triedTimes >= Rule.EMAIL.MAX_TRY_TIMES) {
      throw Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage:
          'reached maximum try times, you can issue new email code and try again.',
      });
    }
    this.triedTimes += 1;
    this.lastTryAt = new Date();
  }

  public increaseRefreshedTimes() {
    if (this.refreshedTimes >= Rule.EMAIL.MAX_REFRESH_TIMES) {
      throw Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: `reached maximum refresh times, you can try again after ${new Date(
          (this.lastTryAt ? this.lastTryAt : this.issuedAt).getTime() +
            Rule.EMAIL.RENEW_DURATION,
        ).toString()}`,
      });
    }
    this.refreshedTimes += 1;
    this.issuedAt = new Date();
  }

  public resetEmailCode() {
    this.verified = false;
    this.code = Email.newEmailCode();
    this.issuedAt = new Date();
    this.triedTimes = this.refreshedTimes = 0;

    this.lastTryAt = null;
  }

  public isVerified() {
    if (
      this.verified &&
      this.lastTryAt!.getTime() + Rule.EMAIL.VALID_IN > Date.now()
    ) {
      return true;
    }
    return false;
  }

  public updateForIssue() {
    const verified = this.getVerified();
    if (verified) {
      if (this.getLastTryAt()!.getTime() + Rule.EMAIL.VALID_IN > Date.now()) {
        throw Exception.new({
          code: Code.BAD_REQUEST_ERROR,
          overrideMessage: 'Your email has just been verified.',
        }); //
      } else {
        this.resetEmailCode();
      }
    } else {
      if (
        this.getIssuedAt().getTime() + Rule.EMAIL.RENEW_DURATION <
        Date.now()
      ) {
        this.resetEmailCode();
      } else {
        this.increaseRefreshedTimes();

        this.code = Email.newEmailCode();
        this.triedTimes = 0;
      }
    }
  }

  public updateForVerify() {
    const verified = this.getVerified();
    if (verified) {
      if (this.getLastTryAt()!.getTime() + Rule.EMAIL.VALID_IN > Date.now()) {
        throw Exception.new({
          code: Code.BAD_REQUEST_ERROR,
          overrideMessage: 'Your email has been verified recently.',
        });
      }
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Please issue new code and verify again.',
      });
    } else {
      if (this.getIssuedAt().getTime() + Rule.EMAIL.ENTER_IN <= Date.now()) {
        throw Exception.new({
          code: Code.ACCESS_DENIED_ERROR,
          overrideMessage:
            'Code is expired, please issue new code and verify again.',
        });
      }
      this.increaseTriedTimes();
    }
  }

  public static async new(payload: CreateEmailEntityPayload): Promise<Email> {
    const email = new Email(payload);
    await email.validate();
    return email;
  }

  public static newEmailCode() {
    let code = '';
    for (let i = 0; i < 6; i++)
      code += Math.floor(Math.random() * 10).toString();
    return code;
  }
}
