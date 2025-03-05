import { formatDurationToNow } from "../../utils/date";

describe("formatDurationToNow", () => {
  it("should return correct duration for minutes", () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    expect(formatDurationToNow(fiveMinutesAgo)).toBe("5min");
  });

  it("should return correct duration for hours", () => {
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    expect(formatDurationToNow(threeHoursAgo)).toBe("3h");
  });

  it("should return correct duration for days", () => {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    expect(formatDurationToNow(twoDaysAgo)).toBe("2j");
  });

  it("should return correct duration for weeks", () => {
    const now = new Date();
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    expect(formatDurationToNow(tenDaysAgo)).toBe("1 semaine");
  });

  it("should return correct duration for months", () => {
    const now = new Date();
    const threeMonthsAgo = new Date(
      now.getTime() - 3 * 31 * 24 * 60 * 60 * 1000
    );
    expect(formatDurationToNow(threeMonthsAgo)).toBe("3 mois");
  });

  it("should return correct duration for years", () => {
    const now = new Date();
    const twoYearsAgo = new Date(now.getTime() - 2 * 366 * 24 * 60 * 60 * 1000);
    expect(formatDurationToNow(twoYearsAgo)).toBe("2 ans");
  });
});
