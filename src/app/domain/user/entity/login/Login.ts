import { Exception } from '@core/Exception';
import { EntityValidatableAdapter } from '@core/class-validator/ValidatableAdapter';
import { Code } from '@core/common/Code';
import { CreateLoginEntityPayload } from './types/CreateLoginEntityPayload';
import { Rule } from '@app/../config/RuleConfig';
import { IsDate, IsEmail, IsNumber } from 'class-validator';

export class Login extends EntityValidatableAdapter {
  @IsEmail()
  private readonly email: string;

  @IsNumber()
  private triedTimes: number;

  @IsDate()
  private lastTryAt: Date;

  constructor(payload: CreateLoginEntityPayload) {
    super();
    this.email = payload.email;
    this.triedTimes = payload.triedTimes || 1;
    this.lastTryAt = payload.lastTryAt || new Date();
  }

  public getEmail() {
    return this.email;
  }
  public getTriedTimes() {
    return this.triedTimes;
  }
  public getLastTryAt() {
    return this.lastTryAt;
  }

  public increaseTriedTimes() {
    if (this.triedTimes >= Rule.LOGIN.MAX_TRY_TIMES)
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: `reached maximum try times, you can reset password or try again after ${new Date(
          this.lastTryAt.getTime() + Rule.LOGIN.RENEW_DURATION,
        ).toString()}`,
      });

    this.triedTimes += 1;
    this.lastTryAt = new Date();
  }

  public reset() {
    this.triedTimes = 1;
    this.lastTryAt = new Date();
  }

  public update() {
    if (
      this.getLastTryAt().getTime() + Rule.LOGIN.RENEW_DURATION <
      Date.now()
    ) {
      this.reset();
    } else {
      this.increaseTriedTimes();
    }
  }

  public static async new(payload: CreateLoginEntityPayload) {
    const login = new Login(payload);
    await login.validate();
    return login;
  }
}
