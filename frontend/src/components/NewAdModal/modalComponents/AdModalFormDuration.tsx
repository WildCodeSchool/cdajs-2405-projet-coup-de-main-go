import { FormControl, FormHelperText, FormLabel, Slider } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { AdInput } from "../../../generated/graphql-types";

export default function AdModalFormDuration() {
  const {
    control,
    formState: { errors },
  } = useFormContext<AdInput>();

  return (
    <>
      <Controller
        name="duration"
        control={control}
        rules={{
          required: "Veuillez sélectionner une durée.",
          validate: (value) => value > 0 || "Veuillez sélectionner une durée.",
        }}
        render={({ field }) => (
          <FormControl>
            <FormLabel sx={{ textAlign: "center" }}>DUREE</FormLabel>
            <Slider
              {...field}
              size="small"
              sx={{ width: "80%", margin: "0 auto" }}
              valueLabelDisplay="auto"
              step={30}
              min={0}
              max={360}
              marks
              valueLabelFormat={(value) => {
                const hours = Math.floor(value / 60);
                const minutes = value % 60;
                if (hours === 0) {
                  return `${minutes}min`;
                } else if (minutes === 0) {
                  return `${hours}h`;
                } else {
                  return `${hours}h ${minutes}min`;
                }
              }}
            />
          </FormControl>
        )}
      />
      <FormHelperText>{errors.duration?.message}</FormHelperText>
    </>
  );
}
