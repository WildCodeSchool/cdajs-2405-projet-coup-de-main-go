import { MockTypeORM } from "mock-typeorm";
import { dataSource } from "./datasource";
import { EntityManager } from "typeorm";
import { resetRedisMock } from "./tests_mockRedis-config";

if (!(global as any).mockTypeOrm) {
  (global as any).mockTypeOrm = new MockTypeORM();
}
export function mockTypeOrm(): MockTypeORM {
  return (global as any).mockTypeOrm;
}

beforeEach(() => {
  mockTypeOrm().resetAll();
  resetRedisMock();

  (dataSource as any).transaction = <T>(
    callback: (entityManager: EntityManager) => Promise<T>
  ) => {
    return callback(dataSource.manager);
  };
});

afterEach(() => {
  jest.restoreAllMocks();
});
