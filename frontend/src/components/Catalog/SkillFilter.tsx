import { FormControl, MenuItem, Select, useMediaQuery } from "@mui/material";
import { Skill } from "../../types";
import theme from "../../mui";

type SkillSelectProps = {
  skills: Skill[];
  selectedSkill: { id: string; name: string } | null;
  setSelectedSkill: (skill: { id: string; name: string } | null) => void;
};

export default function SkillFilter({
  skills,
  selectedSkill,
  setSelectedSkill,
}: SkillSelectProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <FormControl
      sx={{ m: 1, width: 250, paddingBottom: isMobile ? 0 : 8 }}
      size="small"
    >
      <Select
        displayEmpty
        value={selectedSkill?.id || ""}
        onChange={(event) => {
          const selected = skills.find(
            (skill) => skill.id === event.target.value
          );
          setSelectedSkill(selected || null);
        }}
        sx={{
          backgroundColor: "secondary.main",
          color: "white",
          textAlign: "center",
          border: "none",
          borderRadius: "20px",
          "& .MuiSelect-icon": {
            color: "white",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&:hover": {
            backgroundColor: "secondary.dark",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 1,
              borderRadius: "20px",
              backgroundColor: "secondary.main",
              color: "white",
            },
          },
        }}
      >
        <MenuItem
          value=""
          sx={{
            backgroundColor: "secondary.main",
            "&:hover": {
              backgroundColor: "secondary.light",
            },
            "&.Mui-selected": {
              backgroundColor: "secondary.dark",
              "&:hover": {
                backgroundColor: "secondary.light",
              },
            },
          }}
        >
          Toutes les catégories
        </MenuItem>
        {skills.map((skill) => (
          <MenuItem
            key={skill.id}
            value={skill.id}
            sx={{
              backgroundColor: "secondary.main",
              "&:hover": {
                backgroundColor: "secondary.light",
              },
              "&.Mui-selected": {
                backgroundColor: "secondary.dark",
                "&:hover": {
                  backgroundColor: "secondary.light",
                },
              },
            }}
          >
            {skill.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
