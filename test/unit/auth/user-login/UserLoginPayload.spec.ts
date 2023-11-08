import { ExpectUtils } from '../../../utils/ExpectUtils';
import {
  IUserLoginPayload,
  UserLoginPayload,
} from '@app/auth/usecase/user-login/UserLoginPayload';

describe(`User Login Use Case -unit test- validation`, () => {
  test(`When there is no email, it should error 'must be an email'`, async () => {
    expect.hasAssertions();
    try {
      await UserLoginPayload.new({
        password: '12345678',
      } as IUserLoginPayload);
    } catch (error: any) {
      ExpectUtils.validationData(error.data.errors, {
        email: [/must be an email/],
      });
    }
  });

  test(`When there is no password, it should error 'password must be a string'`, async () => {
    expect.hasAssertions();
    try {
      await UserLoginPayload.new({
        email: 'test@email.com',
      } as IUserLoginPayload);
    } catch (error: any) {
      ExpectUtils.validationData(error.data.errors, {
        password: [/must be a string/],
      });
    }
  });

  test(`When password is shorter than 6 characters, it should error 'longer than or equal to 6 characters'`, async () => {
    expect.hasAssertions();
    try {
      await UserLoginPayload.new({
        email: 'test@email.com',
        password: '12345',
      } as IUserLoginPayload);
    } catch (error: any) {
      ExpectUtils.validationData(error.data.errors, {
        password: [/must be longer than or equal to 6 characters/],
      });
    }
  });

  test(`When password is longer than 30 characters, it should error 'shorter or equal to 30 characters'`, async () => {
    expect.hasAssertions();
    try {
      await UserLoginPayload.new({
        email: 'test@email.com',
        password: 'a'.repeat(31),
      } as IUserLoginPayload);
    } catch (error: any) {
      ExpectUtils.validationData(error.data.errors, {
        password: [/must be shorter than or equal to 30 characters/],
      });
    }
  });

  test(`When password contains special characters not included in [$#@&%], it should error 'must match regular expression ...'`, async () => {
    expect.hasAssertions();
    try {
      await UserLoginPayload.new({
        email: 'test@email.com',
        password: '12345**',
      } as IUserLoginPayload);
    } catch (error: any) {
      ExpectUtils.validationData(error.data.errors, {
        password: [/must match/, /regular expression/],
      });
    }
  });

  test(`When email has invalid form, it should error 'must be an email'`, async () => {
    expect.hasAssertions();
    try {
      await UserLoginPayload.new({
        email: 'abc.com',
        password: '123456',
      } as IUserLoginPayload);
    } catch (error: any) {
      ExpectUtils.validationData(error.data.errors, {
        email: [/must be an email/],
      });
    }
  });
  test(`When email is valid and password contains special characters included in [$#@&%], validation should be successful`, async () => {
    await UserLoginPayload.new({
      email: 'test@email.com',
      password: '0x%ab&c$$#$',
    } as IUserLoginPayload);
  });

  test(`When email is valid and password contain alphanumeric characters, validation should be successfull`, async () => {
    await UserLoginPayload.new({
      email: 'test@email.com',
      password: '12345abc',
    } as IUserLoginPayload);
  });

  test(` When there is unneeded fields, it should ingore them`, async () => {
    await UserLoginPayload.new({
      email: 'test@email.com',
      password: '123456',
      code: '1232234',
      token: 'abcdef12345',
    } as IUserLoginPayload);
  });
});
