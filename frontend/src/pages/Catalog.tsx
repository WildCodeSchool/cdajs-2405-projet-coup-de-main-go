import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { useGetAllSkillsQuery } from "../generated/graphql-types";
import { Skill } from "../types";
import { useLocation } from "react-router-dom";
import FilteredAds from "../components/Catalog/FilteredAds";
import CatalogHeader from "../components/Catalog/CatalogHeader";
import SkillFilter from "../components/Catalog/SkillFilter";
import { getDurationValues } from "../utils/duration";
import DurationFilter from "../components/Catalog/DurationFilter";
import theme from "../mui";

export default function Catalog() {
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Store user selection
  const [selectedSkill, setSelectedSkill] = useState<{
    id: string;
    name: string;
  } | null>(location.state?.skill || null);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const { durationMin, durationMax } = getDurationValues(selectedDurations);

  // Fetch SkillFilter options
  const {
    loading: skillsLoading,
    error: skillsError,
    data: skillsData,
  } = useGetAllSkillsQuery({});

  const skills: Skill[] = skillsData?.getAllSkills || [];

  if (skillsLoading) return <CircularProgress />;
  if (skillsError) return <p>Error: {skillsError.message}</p>;
  if (!skillsData) return <Typography>Aucune donnée trouvée</Typography>;

  return (
    <Box sx={{ mx: 6 }}>
      <CatalogHeader selectedSkill={selectedSkill} />

      <Stack
        direction={isMobile ? "column" : "row"}
        sx={{
          justifyContent: isMobile ? "center" : "flex-start",
          alignItems: "center",
        }}
      >
        <SkillFilter
          skills={skills}
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
        />
        <DurationFilter
          selectedDurations={selectedDurations}
          setSelectedDurations={setSelectedDurations}
        />
      </Stack>

      <FilteredAds
        skillId={selectedSkill && selectedSkill.id}
        durationMin={durationMin}
        durationMax={durationMax}
      />
    </Box>
  );
}
