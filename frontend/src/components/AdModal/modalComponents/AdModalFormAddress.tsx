import { Controller, useFormContext } from "react-hook-form";
import { AdInput, GetAdByIdQuery } from "../../../generated/graphql-types";
import { useEffect, useState } from "react";
import { AddressSuggestion } from "../../../types";
import { Autocomplete, TextField } from "@mui/material";
import { fetchAddressSuggestions } from "../../../services/addressService";

interface AdModalFormAddressProps {
  ad?: GetAdByIdQuery["getAdById"] | null | undefined;
}

export default function AdModalFormAddress({ ad }: AdModalFormAddressProps) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<AdInput>();

  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [selectedValue, setSelectedValue] = useState<AddressSuggestion | null>(
    null
  );

  // In editing mode, define selected value in order to display default value
  useEffect(() => {
    if (ad) {
      setSelectedValue({
        properties: {
          label: `${ad.address} ${ad.zipCode} ${ad.city}`,
          name: ad.address,
          postcode: ad.zipCode,
          city: ad.city,
        },
        geometry: {
          coordinates: [ad.longitude ?? 0, ad?.latitude ?? 0],
        },
      });
    }
  }, [ad]);

  return (
    <>
      <Controller
        name="address"
        control={control}
        rules={{
          required: "Champ obligatoire",
        }}
        render={() => (
          <Autocomplete
            options={addressSuggestions}
            value={selectedValue}
            getOptionLabel={(option: AddressSuggestion) =>
              option.properties.label
            }
            onInputChange={async (_, value) => {
              const results = await fetchAddressSuggestions(value);
              setAddressSuggestions(results);
            }}
            onChange={(_, value: AddressSuggestion | null) => {
              setSelectedValue(value);
              if (value) {
                setValue("address", value.properties.name);
                setValue("zipCode", value.properties.postcode);
                setValue("city", value.properties.city);
                setValue("longitude", value.geometry.coordinates[0]);
                setValue("latitude", value.geometry.coordinates[1]);
              }
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
