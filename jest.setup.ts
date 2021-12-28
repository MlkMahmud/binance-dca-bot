import '@testing-library/jest-dom';
// @ts-ignore
import preloadAll from 'jest-next-dynamic';
import 'whatwg-fetch';
import { server } from './__mocks__/server';

beforeAll(async () => {
  await preloadAll();
  server.listen();
});
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
