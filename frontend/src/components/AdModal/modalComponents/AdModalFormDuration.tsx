import { FormControl, FormHelperText, FormLabel, Slider } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { AdInput } from "../../../generated/graphql-types";
import theme from "../../../mui";
import { formatDurationToHourMinute } from "../../../utils/duration";

export default function AdModalFormDuration() {
  const {
    control,
    formState: { errors },
  } = useFormContext<AdInput>();

  return (
    <FormControl>
      <FormLabel
        sx={{
          fontSize: "1.25rem",
          textAlign: "center",
          color: theme.palette.text.secondary,
        }}
      >
        Durée
      </FormLabel>
      <Controller
        name="duration"
        control={control}
        rules={{
          validate: (value) => value > 0 || "Veuillez sélectionner une durée.",
        }}
        render={({ field }) => (
          <>
            <Slider
              {...field}
              size="small"
              sx={{ width: "70%", margin: "0 auto" }}
              step={30}
              min={0}
              max={360}
              marks
              valueLabelDisplay="auto"
              valueLabelFormat={formatDurationToHourMinute}
            />
            <FormHelperText
              error={!!errors.duration}
              sx={{ textAlign: "center" }}
            >
              {errors.duration?.message}
            </FormHelperText>
          </>
        )}
      />
    </FormControl>
  );
}
