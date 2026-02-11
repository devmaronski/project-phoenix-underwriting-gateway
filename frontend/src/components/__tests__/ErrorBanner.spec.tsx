/**
 * Tests for ErrorBanner component.
 * Covers: error display, retry capability, request ID copy.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ErrorBanner } from '@/components/ErrorBanner';
import { createMockErrorResponse } from '@/mocks/loan-review.mock';
import { ErrorCode } from '@/types/api.types';

describe('ErrorBanner', () => {
  it('should display error title and message', () => {
    const error = createMockErrorResponse(ErrorCode.NOT_FOUND);
    const mockRetry = vi.fn();

    render(<ErrorBanner error={error} onRetry={mockRetry} />);

    expect(screen.getByText('Loan Not Found')).toBeInTheDocument();
    expect(screen.getByText(/The loan ID does not exist/)).toBeInTheDocument();
  });

  it('should show request ID', () => {
    const error = createMockErrorResponse(ErrorCode.AI_TIMEOUT);
    const mockRetry = vi.fn();

    render(<ErrorBanner error={error} onRetry={mockRetry} />);

    expect(
      screen.getByText(new RegExp(error.meta.requestId))
    ).toBeInTheDocument();
  });

  it('should show retry button for retryable errors', () => {
    const error = createMockErrorResponse(ErrorCode.AI_TIMEOUT);
    const mockRetry = vi.fn();

    render(<ErrorBanner error={error} onRetry={mockRetry} />);

    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should not show retry button for non-retryable errors', () => {
    const error = createMockErrorResponse(ErrorCode.LEGACY_DATA_CORRUPT);
    const mockRetry = vi.fn();

    render(<ErrorBanner error={error} onRetry={mockRetry} />);

    expect(
      screen.queryByRole('button', { name: /retry/i })
    ).not.toBeInTheDocument();
  });

  it('should copy request ID to clipboard', async () => {
    const error = createMockErrorResponse(ErrorCode.NOT_FOUND);
    const mockRetry = vi.fn();

    // Mock clipboard API
    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined)
    };
    Object.assign(navigator, { clipboard: mockClipboard });

    render(<ErrorBanner error={error} onRetry={mockRetry} />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith(
        error.meta.requestId
      );
    });
  });

  it("should show 'Copied' feedback after copying request ID", async () => {
    const error = createMockErrorResponse(ErrorCode.NOT_FOUND);
    const mockRetry = vi.fn();

    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined)
    };
    Object.assign(navigator, { clipboard: mockClipboard });

    render(<ErrorBanner error={error} onRetry={mockRetry} />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
  });

  it('should handle NETWORK_ERROR correctly', () => {
    const error = createMockErrorResponse(ErrorCode.NETWORK_ERROR);
    const mockRetry = vi.fn();

    render(<ErrorBanner error={error} onRetry={mockRetry} />);

    expect(screen.getByText('Network Error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should handle RISK_SERVICE_DOWN correctly', () => {
    const error = createMockErrorResponse(ErrorCode.RISK_SERVICE_DOWN);
    const mockRetry = vi.fn();

    render(<ErrorBanner error={error} onRetry={mockRetry} />);

    expect(screen.getByText('Service Unavailable')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should handle VALIDATION_FAILED error', () => {
    const error = createMockErrorResponse(ErrorCode.VALIDATION_FAILED);
    const mockRetry = vi.fn();

    render(<ErrorBanner error={error} onRetry={mockRetry} />);

    expect(screen.getByText('Invalid Data')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /retry/i })
    ).not.toBeInTheDocument();
  });
});
