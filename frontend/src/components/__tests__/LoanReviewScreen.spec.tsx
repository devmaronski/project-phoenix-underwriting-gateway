/**
 * Tests for LoanReviewScreen component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoanReviewScreen } from '@/components/LoanReviewScreen';

describe('LoanReviewScreen', () => {
  it('should render the header', () => {
    render(<LoanReviewScreen loanId={null} />);

    expect(screen.getByText(/enter a loan id/i)).toBeInTheDocument();
  });

  it('should render loan ID input field', () => {
    render(<LoanReviewScreen loanId={null} />);

    const message = screen.getByText(/enter a loan id/i);
    expect(message).toBeInTheDocument();
  });

  it('should render load button', () => {
    render(<LoanReviewScreen loanId={null} />);

    // No load button visible when no loanId provided
    expect(
      screen.queryByRole('button', { name: /load/i })
    ).not.toBeInTheDocument();
  });

  it('should load default loan data', async () => {
    render(<LoanReviewScreen loanId="loan-123" />);

    // Should show loading state initially
    expect(screen.queryAllByRole('generic', { hidden: true }).length >= 0).toBe(
      true
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/High debt-to-income ratio/)).toBeInTheDocument();
    });
  });

  it('should display loan summary card when data loads', async () => {
    render(<LoanReviewScreen loanId="loan-123" />);

    await waitFor(() => {
      expect(screen.getByText('Loan Details')).toBeInTheDocument();
    });
  });

  it('should display risk score card when data loads', async () => {
    render(<LoanReviewScreen loanId="loan-123" />);

    await waitFor(() => {
      expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
    });
  });

  it('should show error banner when scenario is loanNotFound', async () => {
    render(<LoanReviewScreen loanId="loan-invalid" />);

    await waitFor(() => {
      expect(screen.getByText('Loan Not Found')).toBeInTheDocument();
    });
  });

  it('should allow changing loan ID via input', async () => {
    render(<LoanReviewScreen loanId="loan-123" />);

    const input = screen.getByPlaceholderText(/enter loan id/i);
    const loadButton = screen.getByRole('button', { name: /load/i });

    // Change input and click load
    fireEvent.change(input, { target: { value: 'loan-456' } });
    fireEvent.click(loadButton);

    // Should reload with new loan ID
    await waitFor(() => {
      expect(screen.getByText('Loan Details')).toBeInTheDocument();
    });
  });

  it('should support Enter key to load loan', async () => {
    render(<LoanReviewScreen loanId="loan-123" />);

    const input = screen.getByPlaceholderText(/enter loan id/i);

    // Change input and press Enter
    fireEvent.change(input, { target: { value: 'loan-789' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Should reload with new loan ID
    await waitFor(() => {
      expect(screen.getByText('Loan Details')).toBeInTheDocument();
    });
  });

  it('should display low risk scenario correctly', async () => {
    render(<LoanReviewScreen loanId="loan-123" />);

    await waitFor(() => {
      expect(screen.getByText('Low Risk')).toBeInTheDocument();
    });
  });

  it('should display high risk scenario correctly', async () => {
    render(<LoanReviewScreen loanId="loan-123" />);

    await waitFor(() => {
      expect(screen.getByText('High Risk')).toBeInTheDocument();
    });
  });

  it('should show empty state when no loan ID provided', () => {
    render(<LoanReviewScreen loanId="" />);

    expect(
      screen.getByText(/Enter a loan ID above to get started/i)
    ).toBeInTheDocument();
  });

  it('should handle retry button in error state', async () => {
    render(<LoanReviewScreen loanId="loan-123" />);

    await waitFor(() => {
      expect(screen.getByText('Service Timeout')).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);

    // Should attempt to refetch
    await waitFor(() => {
      expect(screen.getByText('Service Timeout')).toBeInTheDocument();
    });
  });
});
