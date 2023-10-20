import { Test, TestingModule } from '@nestjs/testing';
import { UserDITokens } from '@app/domain/user/UserDITokens';
import { AuthDITokens } from '@app/auth/AuthDITokens';
import { UserLoginUseCase } from '@app/auth/usecase/user-login/UserLoginUseCase';
import { JwtService } from '@nestjs/jwt';
import { IUserLoginUseCase } from '@app/auth/usecase/usecase.interface';
import { v4 } from 'uuid';
import { UserRole } from '@core/enums/UserEnums';
import { UserLoginPayload } from '@app/auth/usecase/user-login/UserLoginPayload';
import { User } from '@app/domain/user/entity/User';
import { createMock } from '@golevelup/ts-jest';
import { IUserRepository } from '@app/infra/persistence/repository/interface/IUserRepository';
import { ILoginRepository } from '@app/infra/persistence/repository/interface/ILoginRepository';
import { IKeyRepository } from '@app/infra/persistence/repository/interface/IKeyRepository';
import { Login } from '@app/domain/user/entity/login/Login';
import { ExpectUtils } from '../../../utils/ExpectUtils';

let testingModule: TestingModule;
let userLoginUseCase: IUserLoginUseCase;
let userRepo: IUserRepository;
let loginRepo: ILoginRepository;
let keyRepo: IKeyRepository;
let jwtService: JwtService;

let userGetOneSpy: jest.SpyInstance;
let loginGetOneSpy: jest.SpyInstance;
let loginCreateOneSpy: jest.SpyInstance;
let loginUpdateOneSpy: jest.SpyInstance;
let loginDeleteOneSpy: jest.SpyInstance;
let keyUpsertOneSpy: jest.SpyInstance;
let jwtSignSpy: jest.SpyInstance;

describe(`User Login Use Case - unit test`, () => {
  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthDITokens.UserLoginUseCase,
          useClass: UserLoginUseCase,
        },
        {
          provide: UserDITokens.UserRepository,
          useValue: createMock<IUserRepository>(),
        },
        {
          provide: UserDITokens.LoginRepository,
          useValue: createMock<ILoginRepository>(),
        },
        {
          provide: UserDITokens.KeyRepository,
          useValue: createMock<IKeyRepository>(),
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
      ],
    }).compile();
    userLoginUseCase = testingModule.get(AuthDITokens.UserLoginUseCase);
    userRepo = testingModule.get(UserDITokens.UserRepository);
    loginRepo = testingModule.get(UserDITokens.LoginRepository);
    keyRepo = testingModule.get(UserDITokens.KeyRepository);
    jwtService = testingModule.get(JwtService);

    userGetOneSpy = jest.spyOn(userRepo, 'getOne');
    loginGetOneSpy = jest.spyOn(loginRepo, 'getOne');
    loginCreateOneSpy = jest.spyOn(loginRepo, 'createOne');
    loginUpdateOneSpy = jest.spyOn(loginRepo, 'updateOne');
    loginDeleteOneSpy = jest.spyOn(loginRepo, 'deleteOne');
    keyUpsertOneSpy = jest.spyOn(keyRepo, 'upsertOne');
    jwtSignSpy = jest.spyOn(jwtService, 'sign');
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const id = v4();
  const email = 'abc@gmail.com';
  const password = '12345678';
  const role = UserRole.GUEST;

  test(`When there is no user exists, it should error 'user does not exist'`, async () => {
    userGetOneSpy.mockResolvedValue(undefined);
    expect(
      userLoginUseCase.execute({
        email: email,
        password: '000000',
      } as UserLoginPayload),
    ).rejects.toThrow(/User does not exist/);

    expect(userRepo.getOne).toBeCalledTimes(1);
    expect(loginRepo.getOne).not.toBeCalled();
  });

  test(`When there is one that has been removed, it should error 'is currently invalid'`, async () => {
    const user = await User.new({
      id: id,
      email: email,
      password: password,
      role: role,
      removedAt: new Date(),
    });
    userGetOneSpy.mockResolvedValue(user);

    expect(
      userLoginUseCase.execute({
        email: email,
        password: '000000',
      } as UserLoginPayload),
    ).rejects.toThrow(/User is currently invalid/);
    expect(userRepo.getOne).toBeCalledTimes(1);
    expect(loginRepo.getOne).not.toBeCalled();
  });

  test(`When there is valid one and you login for the first time with wrong password, your login attempt should be processed`, async () => {
    const user = await User.new({
      id: id,
      email: email,
      password: password,
      role: role,
    });
    userGetOneSpy.mockResolvedValue(user);
    loginGetOneSpy.mockResolvedValue(undefined);

    try {
      await userLoginUseCase.execute({
        email: email,
        password: 'password',
      } as UserLoginPayload);
    } catch (error: any) {
      expect(error.message).toMatch(/Wrong password/);
    }
    expect(userRepo.getOne).toBeCalledTimes(1);
    expect(loginRepo.getOne).toBeCalledTimes(1);
    expect(loginRepo.createOne).toBeCalledTimes(1);

    expect(loginRepo.updateOne).not.toBeCalled();
    expect(keyRepo.upsertOne).not.toBeCalled();
    expect(loginRepo.deleteOne).not.toBeCalled();
  });

  test(`When you enter the wrong password again, your login attempt's status should be updated `, async () => {
    const login = await Login.new({ email });
    loginGetOneSpy.mockResolvedValue(login);

    try {
      await userLoginUseCase.execute({
        email: email,
        password: '000000',
      } as UserLoginPayload);
    } catch (error: any) {
      expect(error.message).toMatch(/Wrong password/);
    }

    expect(userRepo.getOne).toBeCalledTimes(1);
    expect(loginRepo.getOne).toBeCalledTimes(1);
    expect(loginRepo.createOne).not.toBeCalled();
    expect(loginRepo.updateOne).toBeCalledTimes(1);
  });

  test(`When you login with the right password, you should receive your id and tokens respectively`, async () => {
    jwtSignSpy.mockReturnValue('token');
    const result = await userLoginUseCase.execute({
      email: email,
      password: password,
    } as UserLoginPayload);

    expect(userRepo.getOne).toBeCalledTimes(1);
    expect(loginRepo.getOne).toBeCalledTimes(1);
    expect(loginRepo.createOne).not.toBeCalled();
    expect(loginRepo.updateOne).toBeCalledTimes(1);
    expect(keyRepo.upsertOne).toBeCalledTimes(1);
    expect(loginRepo.deleteOne).toBeCalledTimes(1);
    expect(jwtService.sign).toBeCalledTimes(2);
    ExpectUtils.data(
      { data: result },
      { id: id, accessToken: 'token', refreshToken: 'token' },
    );
  });
});
