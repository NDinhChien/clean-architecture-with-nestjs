jest.mock("typeorm-transactional", () => ({
  Transactional: () => jest.fn(),
  initializeTransactionalContext: () => jest.fn(),
  addTransactionalDataSource: () => jest.fn()
}));
