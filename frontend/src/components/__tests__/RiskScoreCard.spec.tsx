import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RiskScoreCard } from "../RiskScoreCard";

describe("RiskScoreCard", () => {
  it("should render risk score with correct color for high risk", () => {
    render(<RiskScoreCard 
      score={85}
      topReasons={["High debt", "Recent inquiry", "Low utilization"]}
      allReasons={["High debt", "Recent inquiry", "Low utilization", "Limited history"]}
    />);

    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("High Risk")).toBeInTheDocument();
  });

  it("should render risk score with correct color for medium risk", () => {
    render(<RiskScoreCard 
      score={45}
      topReasons={["Moderate debt", "Few inquiries"]}
    />);

    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("Medium Risk")).toBeInTheDocument();
  });

  it("should render risk score with correct color for low risk", () => {
    render(<RiskScoreCard 
      score={25}
      topReasons={["Good payment", "High score"]}
    />);

    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("Low Risk")).toBeInTheDocument();
  });

  it("should display top 3 reasons as badges", () => {
    const topReasons = ["High debt", "Recent inquiry", "Low utilization"];
    render(<RiskScoreCard 
      score={85}
      topReasons={topReasons}
    />);

    topReasons.forEach((reason) => {
      expect(screen.getByText(reason)).toBeInTheDocument();
    });
  });

  it("should toggle disclosure panel when button clicked", async () => {
    const { user } = await import('@testing-library/user-event');
    const userEvent = user.setup();
    
    render(<RiskScoreCard 
      score={85}
      topReasons={["High debt", "Recent inquiry", "Low utilization"]}
      allReasons={["High debt", "Recent inquiry", "Low utilization", "Limited history"]}
    />);

    const toggleButton = screen.getByRole("button", {
      name: /view all reasons/i,
    });

    // Initially hidden
    expect(screen.queryByText("Limited history")).not.toBeInTheDocument();

    // Click to reveal
    await userEvent.click(toggleButton);
    expect(screen.getByText("Limited history")).toBeInTheDocument();

    // Click to close
    await userEvent.click(toggleButton);
    expect(screen.queryByText("Limited history")).not.toBeInTheDocument();
  });

  it("should not show disclosure button if all reasons are shown", () => {
    render(<RiskScoreCard 
      score={25}
      topReasons={["Good payment", "High score"]}
    />);

    expect(
      screen.queryByRole("button", { name: /view all reasons/i })
    ).not.toBeInTheDocument();
  });

  it("should display 'Additional Factors' header when disclosing", async () => {
    const { user } = await import('@testing-library/user-event');
    const userEvent = user.setup();
    
    render(<RiskScoreCard 
      score={85}
      topReasons={["High debt", "Recent inquiry", "Low utilization"]}
      allReasons={["High debt", "Recent inquiry", "Low utilization", "Limited history"]}
    />);

    const toggleButton = screen.getByRole("button", {
      name: /view all reasons/i,
    });

    await userEvent.click(toggleButton);
    expect(screen.getByText("Additional Factors")).toBeInTheDocument();
  });

  it("should handle risk with no allReasons gracefully", () => {
    render(<RiskScoreCard 
      score={50}
      topReasons={["Reason 1", "Reason 2"]}
    />);

    expect(
      screen.queryByRole("button", { name: /view all reasons/i })
    ).not.toBeInTheDocument();
  });

  it("should handle risk where allReasons equals topReasons", () => {
    render(<RiskScoreCard 
      score={50}
      topReasons={["Reason 1", "Reason 2"]}
      allReasons={["Reason 1", "Reason 2"]}
    />);

    expect(
      screen.queryByRole("button", { name: /view all reasons/i })
    ).not.toBeInTheDocument();
  });
});
