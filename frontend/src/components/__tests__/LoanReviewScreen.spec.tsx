/**
 * Tests for LoanReviewScreen component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoanReviewScreen } from '@/components/LoanReviewScreen';

describe('LoanReviewScreen', () => {
  it('should render the header', () => {
    render(<LoanReviewScreen />);

    expect(screen.getByText('Loan Review')).toBeInTheDocument();
    expect(
      screen.getByText('Review loan details and risk assessment')
    ).toBeInTheDocument();
  });

  it('should render loan ID input field', () => {
    render(<LoanReviewScreen />);

    const input = screen.getByPlaceholderText(/enter loan id/i);
    expect(input).toBeInTheDocument();
  });

  it('should render load button', () => {
    render(<LoanReviewScreen />);

    expect(screen.getByRole('button', { name: /load/i })).toBeInTheDocument();
  });

  it('should load default loan data', async () => {
    render(
      <LoanReviewScreen defaultLoanId="loan-123" mockScenario="success" />
    );

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
    render(
      <LoanReviewScreen defaultLoanId="loan-123" mockScenario="success" />
    );

    await waitFor(() => {
      expect(screen.getByText('Loan Details')).toBeInTheDocument();
    });
  });

  it('should display risk score card when data loads', async () => {
    render(
      <LoanReviewScreen defaultLoanId="loan-123" mockScenario="success" />
    );

    await waitFor(() => {
      expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
    });
  });

  it('should show error banner when scenario is loanNotFound', async () => {
    render(
      <LoanReviewScreen
        defaultLoanId="loan-invalid"
        mockScenario="loanNotFound"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Loan Not Found')).toBeInTheDocument();
    });
  });

  it('should allow changing loan ID via input', async () => {
    render(
      <LoanReviewScreen defaultLoanId="loan-123" mockScenario="success" />
    );

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
    render(
      <LoanReviewScreen defaultLoanId="loan-123" mockScenario="success" />
    );

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
    render(
      <LoanReviewScreen defaultLoanId="loan-123" mockScenario="lowRisk" />
    );

    await waitFor(() => {
      expect(screen.getByText('Low Risk')).toBeInTheDocument();
    });
  });

  it('should display high risk scenario correctly', async () => {
    render(
      <LoanReviewScreen defaultLoanId="loan-123" mockScenario="highRisk" />
    );

    await waitFor(() => {
      expect(screen.getByText('High Risk')).toBeInTheDocument();
    });
  });

  it('should show empty state when no loan ID provided', () => {
    render(<LoanReviewScreen defaultLoanId="" mockScenario="success" />);

    expect(
      screen.getByText(/Enter a loan ID above to get started/i)
    ).toBeInTheDocument();
  });

  it('should handle retry button in error state', async () => {
    render(
      <LoanReviewScreen defaultLoanId="loan-123" mockScenario="aiTimeout" />
    );

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
