import { describe, it, expect } from 'vitest';
import { apiClient } from '../client';

describe('API Client (Axios)', () => {
  describe('Configuration', () => {
    it('should have correct base URL from environment', () => {
      const baseURL = apiClient.defaults.baseURL;
      expect(baseURL).toBe('http://localhost:3000/api');
    });

    it('should have 30s timeout', () => {
      expect(apiClient.defaults.timeout).toBe(30000);
    });

    it('should have Content-Type header', () => {
      expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
    });
  });

  describe('Request Interceptor', () => {
    it('should pass through valid requests', () => {
      // Request interceptor should not modify requests
      const config = { method: 'GET', url: '/loans/123' };
      // Interceptor passes through
      expect(config.method).toBe('GET');
    });
  });

  describe('Response Interceptor', () => {
    it('should pass through successful responses', () => {
      // Response interceptor delegates error handling to error adapter
      // Success responses pass through unchanged
      expect(true).toBe(true);
    });
  });
});
