import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the loan review screen", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("Loan Review")).toBeInTheDocument();
    });
  });
});
