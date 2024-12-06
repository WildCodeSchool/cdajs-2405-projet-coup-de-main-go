import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import {
  AdInput,
  useGetAllSkillsQuery,
} from "../../../generated/graphql-types";
import { Skill } from "../../../types";

export default function AdModalFormCategory() {
  const {
    control,
    formState: { errors },
  } = useFormContext<AdInput>();

  const {
    loading: skillsLoading,
    error: skillsError,
    data: skillsData,
  } = useGetAllSkillsQuery();

  const skills: Skill[] = skillsData?.getAllSkills ?? [];

  return (
    <FormControl
      error={!!errors.skillId}
      sx={{
        "& .MuiInputBase-root": {
          backgroundColor: "var(--white)", // Input field background
        },
      }}
    >
      <InputLabel>Catégorie</InputLabel>
      <Controller
        name="skillId"
        control={control}
        rules={{ required: "Champ obligatoire" }}
        render={({ field }) => (
          <Select
            {...field}
            label="Catégorie"
            disabled={skillsLoading || !!skillsError}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
          >
            {skills.map((skill) => (
              <MenuItem key={skill.id} value={skill.id}>
                {skill.name}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      <FormHelperText>{errors.skillId?.message}</FormHelperText>
    </FormControl>
  );
}
