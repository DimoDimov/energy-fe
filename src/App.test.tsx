import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const headerEl = screen.getByText(/Energise You Future!/i);
  expect(headerEl).toBeInTheDocument();
});
