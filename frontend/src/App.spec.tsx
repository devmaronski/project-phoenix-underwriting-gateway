import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the phase 0 message", () => {
    render(<App />);
    expect(screen.getByText("Phase 0 setup is complete.")).toBeInTheDocument();
  });
});
