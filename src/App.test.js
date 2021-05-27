import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("Renders Github Autocomplete", () => {
  render(<App />);
  const githubComponent = screen.getByText(/Github Autocomplete/i);
  expect(githubComponent).toBeInTheDocument();
});
