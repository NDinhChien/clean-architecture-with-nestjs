import { TransactionalUseCase } from './TransactionalUseCase';
import { UseCase } from './UseCase';
import {
  runOnTransactionCommit,
  runOnTransactionRollback,
  Transactional,
} from 'typeorm-transactional';

export class TransactionalUseCaseWrapper<TUseCasePayload, TUseCaseResData>
  implements UseCase<TUseCasePayload, TUseCaseResData>
{
  constructor(
    private readonly useCase: TransactionalUseCase<
      TUseCasePayload,
      TUseCaseResData
    >,
  ) {}

  @Transactional()
  public async execute(payload: TUseCasePayload): Promise<TUseCaseResData> {
    runOnTransactionRollback(
      async (error: Error) => this.useCase.onRollback?.(error, payload),
    );

    const result: TUseCaseResData = await this.useCase.execute(payload);
    runOnTransactionCommit(
      async () => this.useCase.onCommit?.(result, payload),
    );

    return result;
  }
}
