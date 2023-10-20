export interface UseCase<TUseCasePayload, TUseCaseResData> {
  execute(payload?: TUseCasePayload): Promise<TUseCaseResData>;
}
