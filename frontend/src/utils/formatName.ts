export function formatFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName.charAt(0).toUpperCase()}.`;
  }