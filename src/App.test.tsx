import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./app/store";

test("renders marketplace heading", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByText(/CatCart Marketplace/i)).toBeInTheDocument();
});
