export default {
  projects: [
    {
      displayName: 'Components',
      globals: {
        'ts-jest': {
          isolatedModules: true,
          tsconfig: 'tsconfig.test.json',
        },
      },
      preset: 'ts-jest',
      testMatch: ['<rootDir>/__tests__/components/**/*.spec.tsx'],
      setupFilesAfterEnv: ['./jest.setup.ts'],
      testEnvironment: 'jsdom',
    },
    {
      displayName: 'Unit',
      maxWorkers: 1,
      setupFiles: ['dotenv/config'],
      testMatch: ['<rootDir>/__tests__/server/**/*.spec.ts'],
      testEnvironment: 'node',
    },
  ],
};
