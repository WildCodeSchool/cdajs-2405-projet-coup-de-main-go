import {
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetAdByIdQuery } from "../generated/graphql-types";
import DetailAd from "../components/AdDetail/DetailAd";
import DetailUser from "../components/AdDetail/DetailUser";
import theme from "../mui";

export default function Ad() {
  const { adId } = useParams<{ adId: string }>();
  const isResponsiveLayout = useMediaQuery(theme.breakpoints.down("md"));

  const {
    loading: adLoading,
    error: adError,
    data: adData,
  } = useGetAdByIdQuery({ variables: { id: adId || "" }, skip: !adId });

  if (adLoading) return <CircularProgress />;
  if (adError) return <Typography>Erreurr: {adError.message}</Typography>;
  if (!adData) return <Typography>Aucune donnée trouvée</Typography>;

  const ad = adData!.getAdById;

  return (
    <>
      <Stack
        direction={isResponsiveLayout ? "column-reverse" : "row"}
        spacing={4}
        sx={{
          maxWidth: 1200,
          padding: 2,
          mx: "auto",
          alignItems: isResponsiveLayout ? "center" : "flex-start",
        }}
      >
        {/* Encart utilisateur */}
        <Stack
          sx={{
            width: isResponsiveLayout ? "90%" : "33%",
          }}
          spacing={0}
        >
          <DetailUser userId={ad.userRequester.id} />
        </Stack>

        {/* Encart annonce */}
        <Stack
          sx={{
            backgroundColor: theme.palette.common.white,
            borderRadius: "1rem",
            width: isResponsiveLayout ? "90%" : "63%",
          }}
        >
          <DetailAd ad={ad} />
        </Stack>
      </Stack>
    </>
  );
}
