import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatInput } from "../../components/Chat/ChatInput";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

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

  it("renders correctly", async () => {
    renderComponent();

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByTestId("SendIcon")).toBeInTheDocument();
  });

  it("calls onChange when typing", async () => {
    renderComponent();

    const input = screen.getByRole('textbox');
    await userEvent.type(input, "Hello");

    expect(mockOnChange).toHaveBeenCalledTimes(5);
  });

  it("calls onSubmit when button is clicked", async () => {
    renderComponent();

    const button = screen.getByTestId("SendIcon").closest("button");

    if (!button) {
      throw new Error("Button not found");
    }

    await userEvent.click(button);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it("calls onKeyDown when Enter is pressed", async () => {
    renderComponent();

    const input = screen.getByRole('textbox');
    await userEvent.type(input, "{enter}");

    expect(mockOnKeyDown).toHaveBeenCalled();
    expect(mockOnKeyDown).toHaveBeenCalled();
  });
});
