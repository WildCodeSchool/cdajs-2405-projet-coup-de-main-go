export function isBase64(str: string | null | undefined) {
  return typeof str === "string" && str.startsWith("data:image");
}
