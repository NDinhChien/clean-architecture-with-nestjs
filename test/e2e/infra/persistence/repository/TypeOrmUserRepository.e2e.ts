import { DataSource, Repository } from 'typeorm';
import { UserDITokens } from '@app/domain/user/UserDITokens';
import { TypeOrmUser } from '@app/infra/persistence/entity/TypeOrmUser';
import { IUserRepository } from '@app/infra/persistence/repository/interface/IUserRepository';
import AppDataSource from '@app/../data-source';
import { ExpectUtils } from '../../../../utils/ExpectUtils';
import { Test, TestingModule } from '@nestjs/testing';
import { InfraDITokens } from '@app/infra/InfraDITokens';
import { TypeOrmUserRepository } from '@app/infra/persistence/repository/TypeOrmUserRepository';
import { v4 } from 'uuid';
import { UserRole } from '@core/enums/UserEnums';
import { User } from '@app/domain/user/entity/User';
import { TypeOrmUserMapper } from '@app/infra/persistence/entity/mapper/TypeOrmUserMapper';

let testingModule: TestingModule;
let dataSource: DataSource;

let userRepo: IUserRepository;
let userManager: Repository<TypeOrmUser>;

describe(`TypeOrmUserRepository - e2e test`, () => {
  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        {
          provide: InfraDITokens.DataSource,
          useFactory: async () => {
            return AppDataSource.initialize();
          },
        },
        {
          provide: UserDITokens.UserRepository,
          useFactory: (datasource) => new TypeOrmUserRepository(datasource),
          inject: [InfraDITokens.DataSource],
        },
      ],
    }).compile();

    dataSource = testingModule.get(InfraDITokens.DataSource);
    userRepo = testingModule.get(UserDITokens.UserRepository);
    userManager = dataSource.getRepository(TypeOrmUser);

    await userManager.delete({});
  });

  afterAll(async () => {
    await userManager.delete({});
  });
  const id = v4();
  const email = 'test@email.com';
  const password = '12345678';
  const role = UserRole.GUEST;

  describe(`getOne`, () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test(`When user does not exist, it should return undefined`, async () => {
      expect(await userRepo.getOne({ email: email })).toBeUndefined();
    });
    test(`When user exists, finding either by id or email will be successfull.`, async () => {
      const user = await User.new({
        id: id,
        email: email,
        role: role,
        password: password,
      });
      await userManager.save(TypeOrmUserMapper.toOrmEntity(user));
      const user1 = await userRepo.getOne({ email: email });
      const user2 = await userRepo.getOne({ id: id });
      expect(user1).toBeDefined();
      expect(user2).toBeDefined();
      ExpectUtils.data(
        { data: user1, passFields: ['id', 'email', 'role', 'password'] },
        {
          id: user.getId(),
          email: user.getEmail(),
          role: user.getRole(),
          password: user.getPassword(),
        },
      );
      expect(user1).toEqual(user2);
    });
    test(`When user exists, finding user with invalid pair (email, id) should return undefined`, async () => {
      const user = await userRepo.getOne({
        id: id,
        email: 'admin@miracleforyou.com',
      });
      expect(user).toBeUndefined();
    });
    test(`when includeRemoved is unable (false or undefined), it should return undefined`, async () => {
      await userManager.update({ id: id }, { removedAt: new Date() });
      const user = await userRepo.getOne({ id: id });
      expect(user).toBeUndefined();
    });
    test(`when includeRemove is enalbe (true), it should return user`, async () => {
      const user = await userRepo.getOne({ id: id }, { includeRemoved: true });
      expect(user).toBeDefined();
      expect(user?.getCreatedAt()).not.toBe(null);
    });
  });
});
