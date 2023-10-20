import { UseCase } from './UseCase';

export interface TransactionalUseCase<TUseCasePayload, TUseCaseResData>
  extends UseCase<TUseCasePayload, TUseCaseResData> {
  onCommit?: (
    result: TUseCaseResData,
    payload: TUseCasePayload,
  ) => Promise<void>;
  onRollback?: (error: Error, payload: TUseCasePayload) => Promise<void>;
}
