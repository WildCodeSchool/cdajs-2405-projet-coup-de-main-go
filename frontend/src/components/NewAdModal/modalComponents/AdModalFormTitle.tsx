import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { AdInput } from "../../../generated/graphql-types";

export default function AdModalFormTitle() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<AdInput>();

  const [title] = watch("title");

  return (
    <TextField
      type="text"
      label="Titre"
      variant="standard"
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
      error={!!errors.title || title?.length > 50}
      helperText={errors.title?.message}
      sx={{
        backgroundColor: "var(--white)",
      }}
    />
  );
}
