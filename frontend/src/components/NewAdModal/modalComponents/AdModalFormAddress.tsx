import { Controller, useFormContext } from "react-hook-form";
import { AdInput } from "../../../generated/graphql-types";
import { useState } from "react";
import { AddressSuggestion } from "../../../types";
import { Autocomplete, TextField } from "@mui/material";

interface AdModalFormAddressProps {
  setSelectedSuggestion: (value: AddressSuggestion | null) => void;
}

export default function AdModalFormAddress({
  setSelectedSuggestion,
}: AdModalFormAddressProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<AdInput>();

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function isAddressSuggestion(value: any): value is AddressSuggestion {
    return (
      value &&
      typeof value === "object" &&
      "properties" in value &&
      "label" in value.properties
    );
  }

  return (
    <>
      <Controller
        name="address"
        control={control}
        rules={{
          required: "Champ obligatoire",
        }}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={addressSuggestions}
            getOptionLabel={(option: AddressSuggestion) =>
              option.properties.label
            }
            value={isAddressSuggestion(field.value) ? field.value : null}
            onInputChange={(_, value) => {
              fetchAddressSuggestions(value);
            }}
            onChange={(_, value: AddressSuggestion | null) => {
              field.onChange(value);
              setSelectedSuggestion(value);
            }}
            noOptionsText="Saissisez une adresse"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Adresse"
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            )}
          />
        )}
      />
    </>
  );
}
