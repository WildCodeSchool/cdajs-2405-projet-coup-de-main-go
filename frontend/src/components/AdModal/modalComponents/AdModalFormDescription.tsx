import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { AdInput } from "../../../generated/graphql-types";

export default function AdModalFormDescription() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<AdInput>();

  return (
    <TextField
      type="text"
      label="Description"
      multiline
      maxRows={3}
      {...register("description", {
        required: "Champ obligatoire",
        maxLength: {
          value: 255,
          message: "255 caractères maximum",
        },
      })}
      onChange={(e) => {
        const { value } = e.target;
        setValue("description", value, { shouldValidate: true });
      }}
      placeholder="Description"
      error={!!errors.description}
      helperText={errors.description?.message}
      aria-required="true"
    />
  );
}
