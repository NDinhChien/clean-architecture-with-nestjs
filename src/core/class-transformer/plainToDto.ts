import { plainToInstance } from 'class-transformer';

export function plainToDto(classContructor: any, payload: any): any {
  const adapter = plainToInstance(classContructor, payload);

  Object.keys(adapter).forEach((key) => {
    if (adapter[key as any] == null) {
      delete adapter[key as any];
    }
  });
  return adapter;
}
