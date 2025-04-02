import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatInput } from "../../components/Chat/ChatInput";
import '@testing-library/jest-dom'

describe("ChatInput", () => {
  const mockOnChange = vi.fn();
  const mockOnSubmit = vi.fn((e) => e.preventDefault());
  const mockOnKeyDown = vi.fn();

  const renderComponent = () => {
    return render(
      <ChatInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onKeyDown={mockOnKeyDown}
      />
    );
  };

  it("renders correctly", () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText("Entrez votre message...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByTestId("SendIcon")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    renderComponent();
    const input = screen.getByPlaceholderText("Entrez votre message...");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit when button is clicked", () => {
    renderComponent();
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it("calls onKeyDown when Enter is pressed", () => {
    renderComponent();
    const input = screen.getByPlaceholderText("Entrez votre message...");
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
  });
});
