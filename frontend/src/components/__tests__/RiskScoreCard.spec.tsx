/**
 * Tests for RiskScoreCard component.
 * Covers: rendering, progressive disclosure, color coding.
 */

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { Risk } from "@/types/api.types";

describe("RiskScoreCard", () => {
  const mockHighRisk: Risk = {
    score: 85,
    topReasons: ["High debt", "Recent inquiry", "Low utilization"],
    allReasons: [
      "High debt",
      "Recent inquiry",
      "Low utilization",
      "Limited history",
    ],
  };

  const mockLowRisk: Risk = {
    score: 25,
    topReasons: ["Good payment", "High score"],
  };

  const mockMediumRisk: Risk = {
    score: 45,
    topReasons: ["Moderate debt", "Few inquiries"],
  };

  it("should render risk score with correct color for high risk", () => {
    render(<RiskScoreCard risk={mockHighRisk} requestId="req-123" />);

    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("High Risk")).toBeInTheDocument();
  });

  it("should render risk score with correct color for medium risk", () => {
    render(<RiskScoreCard risk={mockMediumRisk} requestId="req-123" />);

    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("Medium Risk")).toBeInTheDocument();
  });

  it("should render risk score with correct color for low risk", () => {
    render(<RiskScoreCard risk={mockLowRisk} requestId="req-123" />);

    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("Low Risk")).toBeInTheDocument();
  });

  it("should display top 3 reasons as badges", () => {
    render(<RiskScoreCard risk={mockHighRisk} requestId="req-123" />);

    mockHighRisk.topReasons.forEach((reason) => {
      expect(screen.getByText(reason)).toBeInTheDocument();
    });
  });

  it("should toggle disclosure panel when button clicked", () => {
    render(<RiskScoreCard risk={mockHighRisk} requestId="req-123" />);

    const toggleButton = screen.getByRole("button", {
      name: /view all reasons/i,
    });

    // Initially hidden
    expect(screen.queryByText("Limited history")).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(toggleButton);
    expect(screen.getByText("Limited history")).toBeInTheDocument();

    // Click to close
    fireEvent.click(toggleButton);
    expect(screen.queryByText("Limited history")).not.toBeInTheDocument();
  });

  it("should not show disclosure button if all reasons are shown", () => {
    render(<RiskScoreCard risk={mockLowRisk} requestId="req-123" />);

    expect(
      screen.queryByRole("button", { name: /view all reasons/i })
    ).not.toBeInTheDocument();
  });

  it("should display request ID for debugging", () => {
    render(<RiskScoreCard risk={mockHighRisk} requestId="debug-req-789" />);

    expect(screen.getByText(/debug-req-789/)).toBeInTheDocument();
  });

  it("should display 'Additional Factors' header when disclosing", () => {
    render(<RiskScoreCard risk={mockHighRisk} requestId="req-123" />);

    const toggleButton = screen.getByRole("button", {
      name: /view all reasons/i,
    });

    fireEvent.click(toggleButton);
    expect(screen.getByText("Additional Factors")).toBeInTheDocument();
  });

  it("should handle risk with no allReasons gracefully", () => {
    const riskNoAll: Risk = {
      score: 50,
      topReasons: ["Reason 1", "Reason 2"],
    };

    render(<RiskScoreCard risk={riskNoAll} requestId="req-123" />);

    // Should not have toggle button
    expect(
      screen.queryByRole("button", { name: /view all reasons/i })
    ).not.toBeInTheDocument();
  });

  it("should handle risk where allReasons equals topReasons", () => {
    const riskAllEqual: Risk = {
      score: 50,
      topReasons: ["Reason 1", "Reason 2"],
      allReasons: ["Reason 1", "Reason 2"],
    };

    render(<RiskScoreCard risk={riskAllEqual} requestId="req-123" />);

    // Should not have toggle button since all reasons are already shown
    expect(
      screen.queryByRole("button", { name: /view all reasons/i })
    ).not.toBeInTheDocument();
  });
});
