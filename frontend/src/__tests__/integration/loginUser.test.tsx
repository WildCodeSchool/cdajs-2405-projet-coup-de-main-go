import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import App from "../../App";
import "@testing-library/jest-dom";
import { AuthProvider } from "../../contexts/AuthContext";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter } from "react-router-dom";
import { mocks } from "./mocks/graphqlMocks";
import { MangoProvider } from "../../contexts/MangoContext";

describe("Login user", () => {
  beforeEach(() => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <MangoProvider>
            <MemoryRouter
              initialEntries={["/"]}
              future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
              <App />
            </MemoryRouter>
          </MangoProvider>
        </AuthProvider>
      </MockedProvider>
    );
  });

  it("should login successfully and display the user name in the header", async () => {
    await act(async () => {
      const button = screen.getByRole("button", {
        name: /s'inscrire \/ se connecter/i,
      });

      fireEvent.click(button);
    });

    await waitFor(() =>
      expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument()
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/E-mail/i), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
        target: { value: "password123" },
      });

      fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));
    });

    await waitFor(() => {
      expect(screen.getByText("John D.")).toBeInTheDocument();
    });
  });
});
