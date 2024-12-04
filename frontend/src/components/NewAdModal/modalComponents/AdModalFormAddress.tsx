import { Autocomplete, TextField } from "@mui/material";
import { AddressSuggestion } from "../../../types";
import { useState } from "react";

interface AdModalFormAddressProps {
  selectedSuggestion: AddressSuggestion | null;
  onSuggestionChange: (value: AddressSuggestion | null) => void;
  error?: string;
}

export default function AdModalFormAddress({
  selectedSuggestion,
  onSuggestionChange,
  error,
}: AdModalFormAddressProps) {
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);

  const fetchAddressSuggestions = async (query: string) => {
    if (query.length >= 3) {
      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
            query
          )}&limit=5`
        );
        const data = await response.json();
        setAddressSuggestions(data.features || []);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des suggestions :",
          error
        );
      }
    }
  };

  return (
    <>
      <Autocomplete
        // {...field}
        options={addressSuggestions}
        getOptionLabel={(option: AddressSuggestion) => option.properties.label}
        value={selectedSuggestion}
        onInputChange={(_, value) => fetchAddressSuggestions(value)}
        onChange={(_, value: AddressSuggestion | null) => {
          onSuggestionChange(value);
        }}
        sx={{ backgroundColor: "white" }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Adresse"
            variant="standard"
            error={!!error}
            helperText={error}
          />
        )}
      />
    </>
  );
}
