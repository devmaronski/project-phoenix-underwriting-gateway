/**
 * Tests for ErrorBanner component.
 * Covers: error display, retry capability, request ID copy.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBanner } from '@/components/ErrorBanner';
import { createMockApiError } from '@/mocks/loan-review.mock';

describe('ErrorBanner', () => {
  it('should display error title and message', () => {
    const error = createMockApiError('NOT_FOUND');
    const mockRetry = vi.fn();

    render(<ErrorBanner error={error} onRetry={mockRetry} />);

    expect(screen.getByText('Loan Not Found')).toBeInTheDocument();
    expect(
      screen.getByText(/The requested loan could not be found/)
    ).toBeInTheDocument();
  });

  it('should show request ID', () => {
    const error = createMockApiError('AI_TIMEOUT');
    const mockRetry = vi.fn();

    render(
      <ErrorBanner
        error={error}
        requestId={error.requestId}
        onRetry={mockRetry}
      />
    );

    expect(screen.getByText(new RegExp(error.requestId!))).toBeInTheDocument();
  });

  it('should show retry button for retryable errors', () => {
    const error = createMockApiError('AI_TIMEOUT');
    const mockRetry = vi.fn();

    render(<ErrorBanner error={error} onRetry={mockRetry} />);

    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should not show retry button for non-retryable errors', () => {
    const error = createMockApiError('LEGACY_DATA_CORRUPT');
    const mockRetry = vi.fn();

    render(<ErrorBanner error={error} onRetry={mockRetry} />);

    expect(
      screen.queryByRole('button', { name: /retry/i })
    ).not.toBeInTheDocument();
  });

  it('should handle NETWORK_ERROR correctly', () => {
    const error = createMockApiError('NETWORK_ERROR');
    const mockRetry = vi.fn();

    render(<ErrorBanner error={error} onRetry={mockRetry} />);

    expect(screen.getByText('Network Error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should handle RISK_SERVICE_DOWN correctly', () => {
    const error = createMockApiError('RISK_SERVICE_DOWN');
    const mockRetry = vi.fn();

    render(<ErrorBanner error={error} onRetry={mockRetry} />);

    expect(screen.getByText('Unknown Error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should handle VALIDATION_FAILED error', () => {
    const error = createMockApiError('VALIDATION_FAILED');
    const mockRetry = vi.fn();

    render(<ErrorBanner error={error} onRetry={mockRetry} />);

    expect(screen.getByText('Invalid Request')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /retry/i })
    ).not.toBeInTheDocument();
  });
});
