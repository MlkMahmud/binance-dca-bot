export default {
  testEnvironment: "jsdom",
  globals: {
    "ts-jest": {
      isolatedModules: true,
      tsconfig: "tsconfig.test.json",
    },
  },
  preset: "ts-jest",
  setupFiles: ["./jest.setup.ts"],
};
