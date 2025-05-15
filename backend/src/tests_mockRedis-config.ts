const mockRedisMethods: Record<string, any> = {
  get: jest.fn(),
  set: jest.fn(),
  setEx: jest.fn(),
  del: jest.fn(),
  flushall: jest.fn(),
  quit: jest.fn().mockResolvedValue("OK"),
  on: jest.fn((event, callback) => {
    if (event === "ready") callback();
    return mockRedisMethods;
  }),
  exists: jest.fn(),
  keys: jest.fn(),
  scan: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      cursor: "0",
      keys: [],
    });
  }),
};

if (!(global as any).mockRedis) {
  (global as any).mockRedis = {
    client: mockRedisMethods,
    createClient: () => mockRedisMethods,
  };
}

export function mockRedis() {
  return (global as any).mockRedis;
}

export function resetRedisMock() {
  Object.values(mockRedisMethods).forEach((mockFn) => {
    if (typeof mockFn.mockReset === "function") {
      mockFn.mockReset();
    }
  });

  mockRedisMethods.get.mockResolvedValue(null);
  mockRedisMethods.set.mockResolvedValue("OK");
  mockRedisMethods.setEx.mockResolvedValue("OK");
  mockRedisMethods.del.mockResolvedValue(1);
  mockRedisMethods.flushall.mockResolvedValue("OK");
  mockRedisMethods.exists.mockResolvedValue(0);
  mockRedisMethods.keys.mockResolvedValue([]);
  mockRedisMethods.quit.mockResolvedValue("OK");
  mockRedisMethods.scan.mockImplementation(() => {
    return Promise.resolve({
      cursor: "0",
      keys: [],
    });
  });
}

resetRedisMock();

jest.mock("redis", () => ({
  createClient: () => mockRedis().client,
  __esModule: true,
}));
