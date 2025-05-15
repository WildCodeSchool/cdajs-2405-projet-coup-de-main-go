import { render, screen } from "@testing-library/react";
import ProfileActiveAds from "../../components/Profile/ProfileActiveAds";
import { deleteAdMocks, mockAuth, mockUserId } from "./mocks/deleteAdMocks";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { AuthContext } from "../../contexts/AuthContext";

const openDeleteAdModal = async () => {
  const deleteButton = await screen.findByRole("button", { name: "Supprimer" });
  await userEvent.click(deleteButton);
};

describe("Delete ad - integration test", () => {
  beforeEach(() => {
    render(
      <MockedProvider mocks={deleteAdMocks} addTypename={false}>
        <MemoryRouter>
          <AuthContext.Provider value={mockAuth}>
            <ProfileActiveAds userId={mockUserId} />
          </AuthContext.Provider>
        </MemoryRouter>
      </MockedProvider>
    );
  });

  it("should display the delete button", async () => {
    const deleteButton = await screen.findByRole("button", {
      name: "Supprimer",
    });
    expect(deleteButton).toBeInTheDocument();
  });

  it("should display the confirmation modal when delete button is clicked", async () => {
    await openDeleteAdModal();

    expect(await screen.findByText("Supprimer l'annonce")).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "Confirmer" })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "Annuler" })
    ).toBeInTheDocument();
  });

  it("should close the confirmation modal when clicking on 'Annuler'", async () => {
    await openDeleteAdModal();
    const cancelButton = await screen.findByRole("button", { name: "Annuler" });
    await userEvent.click(cancelButton);

    expect(screen.queryByText("Supprimer l'annonce")).not.toBeInTheDocument();
  });

  it("should display a success message when 'Confirmer' is clicked", async () => {
    await openDeleteAdModal();

    const confirmButton = await screen.findByRole("button", {
      name: "Confirmer",
    });
    await userEvent.click(confirmButton);

    expect(screen.queryByText("Supprimer l'annonce")).not.toBeInTheDocument();
    expect(
      screen.getByText("Annonce supprimée avec succès !")
    ).toBeInTheDocument();
  });
});
