import { http, HttpResponse } from 'msw';
import {
  MOCK_SCENARIOS,
  createMockErrorResponse
} from '@/mocks/loan-review.mock';
import { ErrorCode } from '@/types/api.types';

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * MSW handlers for loan API endpoints.
 * Intercept HTTP requests and return mock responses.
 */
export const handlers = [
  // Success: Return valid loan review
  http.get(`${API_BASE_URL}/loans/:loanId`, ({ params }) => {
    const { loanId } = params;

    // Simulate specific scenarios based on loan ID
    if (loanId === 'mock-not-found') {
      const errorResponse = createMockErrorResponse(
        ErrorCode.NOT_FOUND,
        'Loan not found'
      );
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    if (loanId === 'mock-legacy-corrupt') {
      const errorResponse = createMockErrorResponse(
        ErrorCode.LEGACY_DATA_CORRUPT,
        'Legacy data validation failed'
      );
      return HttpResponse.json(errorResponse, { status: 422 });
    }

    if (loanId === 'mock-timeout') {
      const errorResponse = createMockErrorResponse(
        ErrorCode.AI_TIMEOUT,
        'Risk service timeout'
      );
      return HttpResponse.json(errorResponse, { status: 503 });
    }

    if (loanId === 'mock-service-down') {
      const errorResponse = createMockErrorResponse(
        ErrorCode.RISK_SERVICE_DOWN,
        'Risk service is unavailable'
      );
      return HttpResponse.json(errorResponse, { status: 503 });
    }

    if (loanId === 'mock-server-error') {
      const errorResponse = createMockErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'Internal server error'
      );
      return HttpResponse.json(errorResponse, { status: 500 });
    }

    // Default: Return success with mock data
    const mockData = MOCK_SCENARIOS.success();
    return HttpResponse.json(mockData, { status: 200 });
  })
];

export default handlers;
