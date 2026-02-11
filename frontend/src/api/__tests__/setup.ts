import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
import { beforeAll, afterEach, afterAll } from 'vitest';

// Create MSW server with handlers
export const server = setupServer(...handlers);

// Enable API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers between tests (allows test-specific overrides)
afterEach(() => server.resetHandlers());

// Disable API mocking after all tests
afterAll(() => server.close());
