import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { AdInput } from "../../../generated/graphql-types";

export default function AdModalFormTitle() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<AdInput>();

  return (
    <TextField
      type="text"
      label="Titre"
      {...register("title", {
        required: "Champ obligatoire",
        maxLength: {
          value: 50,
          message: "50 caractères maximum",
        },
      })}
      onChange={(e) => {
        const { value } = e.target;
        setValue("title", value, { shouldValidate: true });
      }}
      placeholder="Titre de l'annonce"
      error={!!errors.title}
      helperText={errors.title?.message}
      aria-required="true"
    />
  );
}
