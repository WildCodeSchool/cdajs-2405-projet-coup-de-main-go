import { vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { mockData, mocks } from "./mocks/graphqlMocks";
import { MangoProvider } from "../../contexts/MangoContext";
import ChatPage from "../../pages/ChatPage";
import { AuthContext } from "../../contexts/AuthContext";
import theme from "../../mui";
import userEvent from "@testing-library/user-event";

const mockAuth = {
  isAuthenticated: true,
  userId: "user-123",
  setIsAuthenticated: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
};

vi.mock("../../contexts/AuthContext", async () => {
  const actual = await vi.importActual("../../contexts/AuthContext");
  return {
    ...actual,
    useAuth: () => mockAuth,
  };
});

describe("ChatConversation - Integration test for sending messages", () => {
  beforeEach(() => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={["/chat"]}>
          <ThemeProvider theme={theme}>
            <AuthContext.Provider value={mockAuth}>
              <MangoProvider>
                <ChatPage />
              </MangoProvider>
            </AuthContext.Provider>
          </ThemeProvider>
        </MemoryRouter>
      </MockedProvider>
    );
  });

  it("should send a message with ENTER button and clear the input field", async () => {
    await waitFor(() => {
      expect(
        screen.getByTestId("chat-conversation-container")
      ).toBeInTheDocument();
    });

    const conversationButton = screen.getByText("Joe D.");
    await userEvent.click(conversationButton);

    await waitFor(() => {
      expect(screen.getByTestId("chat-message-list")).toBeInTheDocument();
    });

    const messageList = screen.getByTestId("chat-message-list");
    within(messageList).getByText(
      "Bonjour, j'aimerais de l'aide pour mon ordinateur."
    );

    const messageInput = screen.getByRole("textbox");
    const sendButton = screen.getByTestId("SendIcon").closest("button");

    if (!sendButton) {
      throw new Error("Bouton d'envoi introuvable");
    }

    await userEvent.type(messageInput, mockData.testMessage);
    expect(messageInput).toHaveValue(mockData.testMessage);

    await userEvent.click(sendButton);

    await waitFor(() => {
      expect(messageInput).toHaveValue("");
    });
  });
});
