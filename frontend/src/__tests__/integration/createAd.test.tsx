import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdModalForm from "../../components/AdModal/modalComponents/AdModalForm";
import { AuthContext } from "../../contexts/AuthContext";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import { createAdMocks, mockAuth } from "./mocks/createAdMocks";

const mockOnClose = vi.fn();

describe("Create ad modal", () => {
  render(
    <MockedProvider mocks={createAdMocks} addTypename={false}>
      <MemoryRouter>
        <AuthContext.Provider value={mockAuth}>
          <AdModalForm onClose={mockOnClose} />
        </AuthContext.Provider>
      </MemoryRouter>
    </MockedProvider>
  );

  it("should render the modal to create an ad", async () => {
    expect(screen.getByRole("heading")).toHaveTextContent("Créer une annonce");
    expect(screen.getByLabelText("Titre")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Adresse")).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Catégorie" })
    ).toBeInTheDocument();
    expect(screen.getByText("Durée")).toBeInTheDocument();
    expect(screen.getByRole("slider")).toBeInTheDocument();
    expect(screen.getByText("Photos")).toBeInTheDocument();
    expect(screen.getByTestId("picture1")).toBeInTheDocument();
    expect(screen.getByTestId("picture2")).toBeInTheDocument();
    expect(screen.getByTestId("picture3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Valider" })).toBeInTheDocument();
  });
});
