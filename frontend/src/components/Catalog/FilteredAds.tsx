import {
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { AdCardType } from "../../types";
import { Status, useGetAllAdsQuery } from "../../generated/graphql-types";
import AdCard from "../Dashboard/AdCard";
import theme from "../../mui";

interface FilteredAdsProps {
  skillId?: string | null;
  durationMin?: number | null;
  durationMax?: number | null;
  maxDistance: number;
  userLatitude: number | null | undefined;
  userLongitude: number | null | undefined;
}

export default function FilteredAds({
  skillId,
  durationMin,
  durationMax,
  maxDistance,
  userLatitude,
  userLongitude,
}: FilteredAdsProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    loading: adsLoading,
    error: adsError,
    data: adsData,
  } = useGetAllAdsQuery({
    variables: {
      skillId: skillId || null,
      durationMin: durationMin ?? 0,
      durationMax: durationMax ?? 1440,
      status: Status.Posted,
      maxDistance: maxDistance,
      userLatitude: userLatitude,
      userLongitude: userLongitude,
    },
  });

  if (adsLoading) return <CircularProgress />;
  if (adsError) return <p>Error: {adsError.message}</p>;
  if (!adsData) return <Typography>Aucune donnée trouvée</Typography>;

  const adCards: AdCardType[] = adsData?.getAllAds;

  return (
    <>
      {adCards.length > 0 ? (
        <Stack
          direction={isMobile ? "column" : "row"}
          gap={5}
          sx={{
            justifyContent: "flex-start",
            alignItems: "center",
            flexWrap: "wrap",
            mt: 1,
            mb: 6,
          }}
        >
          {adCards.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </Stack>
      ) : (
        <Typography sx={{ my: 10 }}>
          Il n'existe pas d'annonce pour cette catégorie.
        </Typography>
      )}
    </>
  );
}
