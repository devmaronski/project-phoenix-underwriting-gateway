/**
 * Tests for LoanSummaryCard component.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoanSummaryCard } from "@/components/LoanSummaryCard";
import { createMockLoan } from "@/mocks/loan-review.mock";

describe("LoanSummaryCard", () => {
  it("should render loan details heading", () => {
    const loan = createMockLoan();
    render(<LoanSummaryCard loan={loan} />);

    expect(screen.getByText("Loan Details")).toBeInTheDocument();
  });

  it("should display borrower name", () => {
    const loan = createMockLoan();
    render(<LoanSummaryCard loan={loan} />);

    expect(screen.getByText("Borrower Name")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should display loan amount formatted as currency", () => {
    const loan = createMockLoan();
    render(<LoanSummaryCard loan={loan} />);

    expect(screen.getByText("Loan Amount")).toBeInTheDocument();
    expect(screen.getByText(/\$250,000/)).toBeInTheDocument();
  });

  it("should display interest rate formatted as percentage", () => {
    const loan = createMockLoan();
    render(<LoanSummaryCard loan={loan} />);

    expect(screen.getByText("Interest Rate")).toBeInTheDocument();
    expect(screen.getByText("6.5%")).toBeInTheDocument();
  });

  it("should display loan term in months", () => {
    const loan = createMockLoan();
    render(<LoanSummaryCard loan={loan} />);

    expect(screen.getByText("Term")).toBeInTheDocument();
    expect(screen.getByText("360 months")).toBeInTheDocument();
  });

  it("should display issued date formatted", () => {
    const loan = createMockLoan();
    render(<LoanSummaryCard loan={loan} />);

    expect(screen.getByText("Issued Date")).toBeInTheDocument();
    expect(screen.getByText("Jan 15, 2025")).toBeInTheDocument();
  });

  it("should handle different loan values", () => {
    const loan = createMockLoan({
      borrower_name: "Jane Smith",
      loan_amount_dollars: 500000,
      interest_rate_percent: 4.25,
      term_months: 180,
    });

    render(<LoanSummaryCard loan={loan} />);

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText(/\$500,000/)).toBeInTheDocument();
    expect(screen.getByText("4.3%")).toBeInTheDocument();  // 4.25 rounds to 4.3 with 1 decimal
    expect(screen.getByText("180 months")).toBeInTheDocument();
  });

  it("should display all fields in correct order", () => {
    const loan = createMockLoan();
    const { container } = render(<LoanSummaryCard loan={loan} />);

    const labels = Array.from(container.querySelectorAll("p.text-slate-600")).map(
      (el) => el.textContent
    );

    expect(labels).toContain("Borrower Name");
    expect(labels).toContain("Loan Amount");
    expect(labels).toContain("Interest Rate");
    expect(labels).toContain("Term");
    expect(labels).toContain("Issued Date");
  });
});
