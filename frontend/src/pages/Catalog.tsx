import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import {
  useGetAllSkillsQuery,
  useGetUserByIdQuery,
} from "../generated/graphql-types";
import { useLocation } from "react-router-dom";
import FilteredAds from "../components/Catalog/FilteredAds";
import CatalogHeader from "../components/Catalog/CatalogHeader";
import SkillFilter from "../components/Catalog/SkillFilter";
import { getDurationValues } from "../utils/duration";
import DurationFilter from "../components/Catalog/DurationFilter";
import theme from "../mui";
import DistanceFilter from "../components/Catalog/DistanceFilter";
import Cookies from "js-cookie";

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
  const [selectedMaxDistance, setSelectedMaxDistance] = useState<number>(0);

  // Fetch SkillFilter options
  const {
    loading: skillsLoading,
    error: skillsError,
    data: skillsData,
  } = useGetAllSkillsQuery({});

  const skills = skillsData?.getAllSkills;

  // Fetch user's coordinates
  const userId = Cookies.get("cdmg-userId");
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useGetUserByIdQuery({ variables: { id: userId || "" } });

  const user = userData?.getUserById;

  if (skillsLoading) return <CircularProgress />;
  if (skillsError) return <p>Error: {skillsError.message}</p>;
  if (!skills) return <Typography>Aucune donnée trouvée</Typography>;
  if (userLoading) return <CircularProgress />;
  if (userError) return <p>Error: {userError.message}</p>;
  if (!user) return <Typography>Aucune donnée trouvée</Typography>;

  return (
    <Box sx={{ mx: 6 }}>
      <CatalogHeader selectedSkill={selectedSkill} />

      <Stack
        direction={isMobile ? "column" : "row"}
        sx={{
          justifyContent: isMobile ? "center" : "flex-start",
          alignItems: isMobile ? "center" : "flex-start",
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
        {user.latitude && user.longitude && (
          <DistanceFilter
            selectedMaxDistance={selectedMaxDistance}
            setSelectedMaxDistance={setSelectedMaxDistance}
          />
        )}
      </Stack>

      <FilteredAds
        skillId={selectedSkill && selectedSkill.id}
        durationMin={durationMin}
        durationMax={durationMax}
        maxDistance={selectedMaxDistance}
        userLatitude={user.latitude}
        userLongitude={user.longitude}
      />
    </Box>
  );
}
