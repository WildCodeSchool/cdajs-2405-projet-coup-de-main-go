import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { AdInput } from "../../../generated/graphql-types";

export default function AdModalFormDescription() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<AdInput>();
  const [description] = watch("description");

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
      error={!!errors.description || description?.length > 255}
      helperText={errors.description?.message}
    />
  );
}
