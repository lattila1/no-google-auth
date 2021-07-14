import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders App component without crashing", () => {
  render(<App />);
});
