import {
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useGetAdsByUserQuery } from "../../generated/graphql-types";
import AdCard from "../AdCard/AdCard";
import theme from "../../mui";
import { AdCardType } from "../../types";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

interface ProfileAdsProps {
  userId: string;
}

export default function ProfileActiveAds({ userId }: ProfileAdsProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.message) {
      toast.success(location.state.message);
    }
  }, [location]);

  // Fetch ads for the user
  const {
    loading: adsLoading,
    error: adsError,
    data: adsData,
  } = useGetAdsByUserQuery({
    variables: {
      userId: userId,
    },
  });

  if (adsLoading) return <CircularProgress />;
  if (adsError) return <p>Error: {adsError.message}</p>;
  if (!adsData) return <Typography>Aucune donnée trouvée</Typography>;

  const adCards: AdCardType[] = adsData?.getAdsByUser;

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
            <AdCard key={ad.id} ad={ad} isProfileCard={true} />
          ))}
        </Stack>
      ) : (
        <Typography sx={{ my: 10 }}>
          Vous n'avez encore publié aucune annonce.
        </Typography>
      )}
      <ToastContainer position="bottom-right" />
    </>
  );
}
