const mockRedisMethods: Record<string, any> = {
  get: jest.fn(),
  set: jest.fn(),
  setEx: jest.fn(),
  del: jest.fn(),
  flushall: jest.fn(),
  quit: jest.fn(),
  on: jest.fn((event, callback) => {
    if (event === 'ready') callback();
    return mockRedisMethods;
  }),
  exists: jest.fn(),
  keys: jest.fn(),
};

if (!(global as any).mockRedis) {
  (global as any).mockRedis = {
    client: mockRedisMethods,
    createClient: () => mockRedisMethods
  };
}

export function mockRedis() {
  return (global as any).mockRedis;
}

export function resetRedisMock() {
  Object.values(mockRedisMethods).forEach(mockFn => {
    if (typeof mockFn.mockReset === 'function') {
      mockFn.mockReset();
    }
  });
  
  mockRedisMethods.get.mockResolvedValue(null);
  mockRedisMethods.set.mockResolvedValue('OK');
  mockRedisMethods.setEx.mockResolvedValue('OK');
  mockRedisMethods.del.mockResolvedValue(1);
  mockRedisMethods.flushall.mockResolvedValue('OK');
  mockRedisMethods.exists.mockResolvedValue(0);
  mockRedisMethods.keys.mockResolvedValue([]);
}

resetRedisMock();

jest.mock('redis', () => ({
  createClient: () => mockRedis().client,
  __esModule: true
}));