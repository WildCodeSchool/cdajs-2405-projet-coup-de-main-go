import { Box, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { useGetAllSkillsQuery } from "../generated/graphql-types";
import { Skill } from "../types";
import { useLocation } from "react-router-dom";
import FilteredAds from "../components/Catalog/FilteredAds";
import CatalogHeader from "../components/Catalog/CatalogHeader";
import SkillFilter from "../components/Catalog/SkillFilter";

export default function Catalog() {
  const location = useLocation();

  // Store user selection
  const [selectedSkill, setSelectedSkill] = useState<{
    id: string;
    name: string;
  } | null>(location.state?.skill || null);

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

      {!skillsLoading && !skillsError && (
        <>
          <SkillFilter
            skills={skills}
            selectedSkill={selectedSkill}
            setSelectedSkill={setSelectedSkill}
          />
          <FilteredAds skillId={selectedSkill ? selectedSkill.id : undefined} />
        </>
      )}
    </Box>
  );
}
