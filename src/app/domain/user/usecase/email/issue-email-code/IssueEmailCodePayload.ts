import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { UseCaseValidatableAdapter } from '@core/class-validator/ValidatableAdapter';

export interface IIssueEmailCodeBody {
  email: string;
}
export interface IIssueEmailCodePayload extends IIssueEmailCodeBody {}

@Exclude()
export class IssueEmailCodePayload
  extends UseCaseValidatableAdapter
  implements IIssueEmailCodePayload
{
  @Expose()
  @IsEmail()
  public email: string;

  public static async new(payload: IIssueEmailCodePayload) {
    const adapter: IssueEmailCodePayload = plainToInstance(
      IssueEmailCodePayload,
      payload,
    );
    await adapter.validate();
    return adapter;
  }
}
