import { Response } from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { UserDITokens } from '@app/domain/user/UserDITokens';
import { TypeOrmUser } from '@app/infra/persistence/entity/TypeOrmUser';
import { IUserRepository } from '@app/infra/persistence/repository/interface/IUserRepository';
import { ExpectUtils } from '../../../utils/ExpectUtils';
import { Code } from '@core/common/Code';
import { ILoginRepository } from '@app/infra/persistence/repository/interface/ILoginRepository';
import { IKeyRepository } from '@app/infra/persistence/repository/interface/IKeyRepository';
import { User } from '@app/domain/user/entity/User';
import { UserRole } from '@core/enums/UserEnums';
import { Rule } from '@app/../config/RuleConfig';
import { v4 } from 'uuid';
import { TypeOrmLogin } from '@app/infra/persistence/entity/TypeOrmLogin';
import { TypeOrmKey } from '@app/infra/persistence/entity/TypeOrmKey';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { RootModule } from '@app/RootModule';
import { InfraDITokens } from '@app/infra/InfraDITokens';
import * as supertest from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { IUserLoginUseCase } from '@app/auth/usecase/usecase.interface';
import { AuthDITokens } from '@app/auth/AuthDITokens';

let testingModule: TestingModule;
let app: NestExpressApplication;
let dataSource: DataSource;
let request: supertest.SuperTest<supertest.Test>;

let usecase: IUserLoginUseCase;
let userRepo: IUserRepository;
let loginRepo: ILoginRepository;
let keyRepo: IKeyRepository;
let jwtService: JwtService;
let userManager: Repository<TypeOrmUser>;
let loginManager: Repository<TypeOrmLogin>;
let keyManager: Repository<TypeOrmKey>;

let executeSpy: any;
let userGetOneSpy: any;
let loginGetOneSpy: any;
let keyUpsertOneSpy: any;
let loginDeleteOneSpy: any;
let signSpy: any;
const originalMaxTryTimes = Rule.LOGIN.MAX_TRY_TIMES;

describe('POST /users/login - User Login UseCase', () => {
  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [RootModule],
    }).compile();

    app = testingModule.createNestApplication();
    dataSource = testingModule.get(InfraDITokens.DataSource);
    request = supertest(app.getHttpServer());

    usecase = testingModule.get(AuthDITokens.UserLoginUseCase);
    userRepo = testingModule.get(UserDITokens.UserRepository);
    loginRepo = testingModule.get(UserDITokens.LoginRepository);
    keyRepo = testingModule.get(UserDITokens.KeyRepository);
    jwtService = testingModule.get(JwtService);

    executeSpy = jest.spyOn(usecase, 'execute');
    userGetOneSpy = jest.spyOn(userRepo, 'getOne');
    loginGetOneSpy = jest.spyOn(loginRepo, 'getOne');
    keyUpsertOneSpy = jest.spyOn(keyRepo, 'upsertOne');
    loginDeleteOneSpy = jest.spyOn(loginRepo, 'deleteOne');
    signSpy = jest.spyOn(jwtService, 'sign');

    userManager = dataSource.getRepository(TypeOrmUser);
    keyManager = dataSource.getRepository(TypeOrmKey);
    loginManager = dataSource.getRepository(TypeOrmLogin);

    await userManager.delete({});
    await keyManager.delete({});
    await loginManager.delete({});

    Rule.LOGIN.MAX_TRY_TIMES = 3;
    await app.init();
  });

  afterAll(async () => {
    await userManager.delete({});
    await keyManager.delete({});
    await loginManager.delete({});

    Rule.LOGIN.MAX_TRY_TIMES = originalMaxTryTimes;
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  const endpoint = '/auth/login';
  const id = v4();
  const email = 'test@email.com';
  const password = '12345678';
  const role = UserRole.GUEST;

  test(`When there is no user exists, it should error 'user does not exist'`, async () => {
    const response: Response = await request.post(endpoint).send({
      email: email,
      password: '000000',
    });
    expect(executeSpy).toBeCalledTimes(1);
    expect(userGetOneSpy).toBeCalledTimes(1);
    expect(loginGetOneSpy).not.toBeCalled();
    expect(keyUpsertOneSpy).not.toBeCalled();
    expect(loginDeleteOneSpy).not.toBeCalled();
    expect(signSpy).not.toBeCalled();
    ExpectUtils.codeAndMessage(response.body, Code.BAD_REQUEST_ERROR.code, [
      /User does not exist/,
    ]);
  });

  test(`When there is one who has been removed, it should error 'is currently invalid'`, async () => {
    const user = await User.new({
      id: id,
      email: email,
      password: password,
      role: role,
      removedAt: new Date(),
    });
    await userRepo.createOne(user);
    const response: Response = await request.post(endpoint).send({
      email: email,
      password: '000000',
    });
    expect(executeSpy).toBeCalledTimes(1);
    expect(userGetOneSpy).toBeCalledTimes(1);
    expect(loginGetOneSpy).not.toBeCalled();
    expect(keyUpsertOneSpy).not.toBeCalled();
    expect(loginDeleteOneSpy).not.toBeCalled();
    expect(signSpy).not.toBeCalled();
    ExpectUtils.codeAndMessage(response.body, Code.BAD_REQUEST_ERROR.code, [
      /User is currently invalid/,
    ]);
  });

  test(`When there is valid one and you login the first time with wrong password, it should error 'Wrong password, ${
    Rule.LOGIN.MAX_TRY_TIMES - 1
  } times left'`, async () => {
    await userManager.update({ id: id }, { removedAt: null });
    const response: Response = await request.post(endpoint).send({
      email: email,
      password: '000000',
    });
    expect(executeSpy).toBeCalledTimes(1);
    expect(userGetOneSpy).toBeCalledTimes(1);
    expect(loginGetOneSpy).toBeCalledTimes(1);
    expect(keyUpsertOneSpy).not.toBeCalled();
    expect(loginDeleteOneSpy).not.toBeCalled();
    expect(signSpy).not.toBeCalled();
    ExpectUtils.codeAndMessage(
      response.body,
      Code.WRONG_CREDENTIALS_ERROR.code,
      [
        /Wrong password/,
        new RegExp(`${Rule.LOGIN.MAX_TRY_TIMES - 1} times left`),
      ],
    );
  });

  test(`When you enter the wrong password again, it should error 'Wrong password, ${
    Rule.LOGIN.MAX_TRY_TIMES - 2
  } times left'`, async () => {
    const response: Response = await request.post(endpoint).send({
      email: email,
      password: '000000',
    });
    expect(executeSpy).toBeCalledTimes(1);
    expect(userGetOneSpy).toBeCalledTimes(1);
    expect(loginGetOneSpy).toBeCalledTimes(1);
    expect(keyUpsertOneSpy).not.toBeCalled();
    expect(loginDeleteOneSpy).not.toBeCalled();
    expect(signSpy).not.toBeCalled();
    ExpectUtils.codeAndMessage(
      response.body,
      Code.WRONG_CREDENTIALS_ERROR.code,
      [
        /Wrong password/,
        new RegExp(`${Rule.LOGIN.MAX_TRY_TIMES - 2} times left`),
      ],
    );
  });

  test(`When you enter wrong password the another time, it should error 'Wrong password, ${
    Rule.LOGIN.MAX_TRY_TIMES - 3
  } times left'`, async () => {
    const response: Response = await request.post(endpoint).send({
      email: email,
      password: '000000',
    });
    expect(executeSpy).toBeCalledTimes(1);
    expect(userGetOneSpy).toBeCalledTimes(1);
    expect(loginGetOneSpy).toBeCalledTimes(1);
    expect(keyUpsertOneSpy).not.toBeCalled();
    expect(loginDeleteOneSpy).not.toBeCalled();
    expect(signSpy).not.toBeCalled();
    ExpectUtils.codeAndMessage(
      response.body,
      Code.WRONG_CREDENTIALS_ERROR.code,
      [
        /Wrong password/,
        new RegExp(`${Rule.LOGIN.MAX_TRY_TIMES - 3} times left`),
      ],
    );
  });

  test(`If you continue to login, it should error 'reached maximum try times'`, async () => {
    const response: Response = await request.post(endpoint).send({
      email: email,
      password: '000000',
    });
    expect(executeSpy).toBeCalledTimes(1);
    expect(userGetOneSpy).toBeCalledTimes(1);
    expect(loginGetOneSpy).toBeCalledTimes(1);
    expect(keyUpsertOneSpy).not.toBeCalled();
    expect(loginDeleteOneSpy).not.toBeCalled();
    expect(signSpy).not.toBeCalled();
    ExpectUtils.codeAndMessage(response.body, Code.BAD_REQUEST_ERROR.code, [
      /reached maximum try times/,
    ]);
  });

  test(`When it has been a long time since your last login attempt (over RENEW_DURATION), it should reset try times`, async () => {
    await loginManager.update(
      { email: email },
      { lastTryAt: new Date(Date.now() - Rule.LOGIN.RENEW_DURATION - 2000) },
    );
    const response: Response = await request.post(endpoint).send({
      email: email,
      password: '000000',
    });
    expect(executeSpy).toBeCalledTimes(1);
    expect(userGetOneSpy).toBeCalledTimes(1);
    expect(loginGetOneSpy).toBeCalledTimes(1);
    expect(keyUpsertOneSpy).not.toBeCalled();
    expect(loginDeleteOneSpy).not.toBeCalled();
    expect(signSpy).not.toBeCalled();
    ExpectUtils.codeAndMessage(
      response.body,
      Code.WRONG_CREDENTIALS_ERROR.code,
      [
        /Wrong password/,
        new RegExp(`${Rule.LOGIN.MAX_TRY_TIMES - 1} times left`),
      ],
    );
  });
  test(` When you enter the right password, you should receive your id and tokens respectively`, async () => {
    const response: Response = await request.post(endpoint).send({
      email: email,
      password: password,
    });
    expect(executeSpy).toBeCalledTimes(1);
    expect(userGetOneSpy).toBeCalledTimes(1);
    expect(loginGetOneSpy).toBeCalledTimes(1);
    expect(keyUpsertOneSpy).toBeCalledTimes(1);
    expect(loginDeleteOneSpy).toBeCalledTimes(1);
    expect(signSpy).toBeCalledTimes(2);
    ExpectUtils.codeAndMessage(response.body, Code.SUCCESS.code, [
      /Login successfully./,
    ]);
    const data = response.body.data;
    ExpectUtils.data({ data: data, passFields: ['id'] }, { id: id });
    expect(data.refreshToken).toBeDefined();
    expect(data.accessToken).toBeDefined();
  });
});
