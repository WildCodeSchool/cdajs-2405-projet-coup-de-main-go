import { render, screen } from "@testing-library/react";
import App from "../../App";
import "@testing-library/jest-dom";
import { AuthProvider } from "../../contexts/AuthContext";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter } from "react-router-dom";
import { mocks } from "./mocks/graphqlMocks";

describe("Guest user landing page", () => {
  beforeEach(() => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <MemoryRouter
            initialEntries={["/"]}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <App />
          </MemoryRouter>
        </AuthProvider>
      </MockedProvider>
    );
  });

  it("should render the Header and Footer", async () => {
    const headerElement = screen.getByRole("banner"); // MUI uses the "banner" role for the Header component
    expect(headerElement).toBeInTheDocument();

    const footerElement = screen.getByRole("contentinfo"); // MUI uses the "contentinfo" role for the Footer component
    expect(footerElement).toBeInTheDocument();
  });
});
