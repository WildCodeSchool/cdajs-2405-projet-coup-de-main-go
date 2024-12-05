import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import {
  AdInput,
  useGetAllSkillsQuery,
} from "../../../generated/graphql-types";
import { Skill } from "../../../types";

export default function AdModalFormCategory() {
  const {
    register,
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
      variant="standard"
      sx={{ backgroundColor: "var(--white)" }}
    >
      <InputLabel>Catégorie</InputLabel>
      <Select
        {...register("skillId", { required: "Champ obligatoire" })}
        defaultValue=""
        disabled={skillsLoading || !!skillsError}
      >
        {skills.map((skill) => (
          <MenuItem key={skill.id} value={skill.id}>
            {skill.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{errors.skillId?.message}</FormHelperText>
    </FormControl>
  );
}
