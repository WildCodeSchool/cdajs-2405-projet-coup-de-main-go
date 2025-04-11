import { AddressSuggestion } from "../types";

export async function fetchAddressSuggestions(
  query: string
): Promise<AddressSuggestion[]> {
  if (query.length < 3) return [];

  try {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
        query
      )}&limit=5`
    );
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des suggestions :", error);
    return [];
  }
}
