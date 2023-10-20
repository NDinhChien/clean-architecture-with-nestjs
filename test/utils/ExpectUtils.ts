import { CoreApiResponse } from "@core/CoreApiResponse";

export function filterObject(object: any, passFields: string[]): Record<string, unknown> {
  const filteredObject: Record<string, unknown> = {};
  
  for (const field of passFields) {
    filteredObject[field] = object[field]
  }
  
  return filteredObject;
}
 

export class ExpectUtils {
  
  public static codeAndMessage(response: CoreApiResponse<unknown>, code: number, regExps: RegExp[]): void {
    const filteredRes = filterObject(response, ['code', 'message'])
    expect(filteredRes.code).toEqual(code);
    for (const regExp of regExps) {
      expect(filteredRes.message).toMatch(regExp);
    }
  }
  
  public static data(options: {data: unknown, passFields?: string[]}, expected: unknown): void {
    const toFilterObject = (object: any): unknown => {
      return options.passFields
        ? filterObject(object, options.passFields)
        : object;
    };
    
    const filteredData: unknown = Array.isArray(options.data)
      ? options.data.map(item => toFilterObject(item))
      : toFilterObject(options.data);
    
    expect(filteredData).toEqual(expected);
  }
  public static validationData(
      data: {property: string, message: string[]}[],
      expected: Record<string, RegExp[]>
    ): void {

    expect(data.length).toEqual(Object.keys(expected).length);
    
    for (const {property, message} of data) {
      expect(expected[property]).toBeDefined();
      for (const regExp of expected[property]) {
        let valid = false;
        for (const msg of message) {
          if (regExp.test(msg)) {
            valid = true;
            break;
          }
        }
        expect(valid).toBeTruthy();
      }
    }
    
  }
}