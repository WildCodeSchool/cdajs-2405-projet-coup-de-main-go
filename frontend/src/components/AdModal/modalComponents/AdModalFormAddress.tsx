import { Controller, useFormContext } from "react-hook-form";
import { AdInput } from "../../../generated/graphql-types";
import { useState } from "react";
import { AddressSuggestion } from "../../../types";
import { Autocomplete, TextField } from "@mui/material";
import { fetchAddressSuggestions } from "../../../services/addressService";

interface AdModalFormAddressProps {
  setSelectedSuggestion: (value: AddressSuggestion | null) => void;
  selectedSuggestion?: AddressSuggestion | null;
}

export default function AdModalFormAddress({
  setSelectedSuggestion,
  selectedSuggestion,
}: AdModalFormAddressProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<AdInput>();

  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);

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
            // value={isAddressSuggestion(field.value) ? field.value : null}
            value={selectedSuggestion}
            onInputChange={async (_, value) => {
              const results = await fetchAddressSuggestions(value);
              setAddressSuggestions(results);
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
