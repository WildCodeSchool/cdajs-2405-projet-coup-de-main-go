import {
  CircularProgress,
  Pagination,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Status, useGetAllAdsQuery } from "../../generated/graphql-types";
import AdCard from "../AdCard/AdCard";
import theme from "../../mui";
import { useState } from "react";

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
  const [page, setPage] = useState<number>(1);
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
      page: page,
    },
  });

  if (adsLoading) return <CircularProgress />;
  if (adsError) return <p>Error: {adsError.message}</p>;
  if (!adsData) return <Typography>Aucune donnée trouvée</Typography>;

  const adsResponse = adsData?.getAllAds;

  // Manage pagination
  const limit = 15;
  const pageCount = Math.ceil(adsResponse.adsCount / limit);

  return (
    <>
      {adsResponse.ads.length > 0 ? (
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
          {adsResponse.ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </Stack>
      ) : (
        <Typography sx={{ my: 10 }}>
          Il n'existe pas d'annonce correspondant à cette recherche.
        </Typography>
      )}

      {pageCount > 1 && (
        <Pagination
          count={pageCount < 10 ? pageCount : 10}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{ marginTop: 6, display: "flex", justifyContent: "center" }}
        />
      )}
    </>
  );
}
