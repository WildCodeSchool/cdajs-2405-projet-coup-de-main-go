export const getUserIdFromCookie = (): string | null => {
    const userId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userId="))
      ?.split("=")[1];
    return userId || "1";
  };
  