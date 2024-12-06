import { Stack, useMediaQuery } from "@mui/material";
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

  if (adLoading) return <p>Loading...</p>;
  if (adError) return <p>Error: {adError.message}</p>;
  if (!adData) return <p>No data found</p>;

  const ad = adData!.getAdById;

  return (
    <>
      <Stack
        direction={isResponsiveLayout ? "column-reverse" : "row"}
        spacing={4}
        sx={{
          maxWidth: "63rem",
          margin: "2rem auto",
          alignItems: isResponsiveLayout ? "center" : "flex-start",
        }}
      >
        <Stack
          sx={{
            borderRadius: "1rem",
            width: isResponsiveLayout ? "90%" : "33%",
          }}
          spacing={0}
        >
          <DetailUser ad={ad} />
        </Stack>
        <Stack
          sx={{
            backgroundColor: "var(--white)",
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
