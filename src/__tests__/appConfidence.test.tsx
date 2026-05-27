import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "../App";

describe("App confidence integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("opens the Confidence 90 page from the sidebar", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Confidence" }));

    expect(screen.getByRole("heading", { name: "ความมั่นใจ 90 วัน" })).toBeInTheDocument();
    expect(screen.getByText("สัญญาความมั่นใจวันนี้")).toBeInTheDocument();
  });
});
