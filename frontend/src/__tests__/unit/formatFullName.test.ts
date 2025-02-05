import { formatFullName } from "../../utils/formatName";

describe("formatFullName", () => {
  it("should correctly format the full name", () => {
    expect(formatFullName("John", "Doe")).toBe("John D.");
    expect(formatFullName("Jane", "Smith")).toBe("Jane S.");
  });

  it("should handle single-letter first name", () => {
    expect(formatFullName("J", "Doe")).toBe("J D.");
  });
});
