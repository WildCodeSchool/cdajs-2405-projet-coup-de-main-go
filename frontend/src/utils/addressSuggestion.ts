import { AddressSuggestion } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isAddressSuggestion(value: any): value is AddressSuggestion {
  return (
    value &&
    typeof value === "object" &&
    "properties" in value &&
    typeof value.properties === "object" &&
    "label" in value.properties &&
    "name" in value.properties &&
    "postcode" in value.properties &&
    "city" in value.properties &&
    "geometry" in value &&
    typeof value.geometry === "object" &&
    Array.isArray(value.geometry.coordinates) &&
    value.geometry.coordinates.length === 2
  );
}
