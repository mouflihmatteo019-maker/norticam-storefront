export default { test: { environment: 'node', include: ['client/src/**/*.test.ts'], restoreMocks: true, poolOptions: { forks: { singleFork: true } } } };
