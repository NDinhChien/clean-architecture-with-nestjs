import { Login } from "@app/domain/user/entity/login/Login";
import { Rule } from "@app/../config/RuleConfig";


const originalMaxTryTimes = Rule.LOGIN.MAX_TRY_TIMES;
describe(`Login Domain entity - unit test`, () => {
  const email = 'abc@gmail.com';
  let increaseTriedTimesSpy: any;
  let resetSpy: any;
  let login: Login;
  beforeAll(() => {
    Rule.LOGIN.MAX_TRY_TIMES = 3;
  })
  afterAll(() => {
    Rule.LOGIN.MAX_TRY_TIMES - originalMaxTryTimes;
  })
  beforeEach(()=>{
    jest.clearAllMocks()
  })

  test(`Create a new Login (when user login the first time), triedTime value should be 1`, async () => {
    login = await Login.new({email: email});
    increaseTriedTimesSpy = jest.spyOn(login, 'increaseTriedTimes');
    resetSpy = jest.spyOn(login, 'reset');

    expect(login.getEmail()).toEqual(email);
    expect(login.getTriedTimes()).toEqual(1);
    expect(login.getLastTryAt()).toBeDefined();
  })

  test(`Update Login status (when user tries to login after failures), triedTime value should be 2`, async () => {
    login.update();
    expect(login.getEmail()).toEqual(email);
    expect(login.getTriedTimes()).toEqual(2);
    expect(login.getLastTryAt()).toBeDefined();
    expect(increaseTriedTimesSpy).toBeCalledTimes(1);
    
  })

  test(`Update Login status again, triedTime value should be 3`, async () => {
    login.update();
    expect(login.getEmail()).toEqual(email);
    expect(login.getTriedTimes()).toEqual(3);
    expect(login.getLastTryAt()).toBeDefined();
    expect(increaseTriedTimesSpy).toBeCalledTimes(1);

    
  })

  test(`Update Login status again, it should error 'reached maximum try times'`, async () => {
    expect.hasAssertions()
    try {
      login.update();
    } catch (error: any) {
      expect(error.message).toMatch(/reached maximum try times/);
    }
  })

  test(`Update Login status after a very long time (over RENEW_DURATION) since users last try, triedTimes value should be 1 (be reset)`, async () => {
    login = await Login.new({email: email, triedTimes: login.getTriedTimes(), lastTryAt: new Date(Date.now() - Rule.LOGIN.RENEW_DURATION - 1000)});
    increaseTriedTimesSpy = jest.spyOn(login, 'increaseTriedTimes');
    resetSpy = jest.spyOn(login, 'reset');
    login.update()
    expect(login.getEmail()).toEqual(email);
    expect(login.getTriedTimes()).toEqual(1);
    expect(login.getLastTryAt()).toBeDefined();
    expect(increaseTriedTimesSpy).toBeCalledTimes(0);
    expect(resetSpy).toBeCalledTimes(1);
  })
})