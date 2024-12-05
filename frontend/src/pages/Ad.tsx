import { Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetAdByIdQuery } from "../generated/graphql-types";
import DetailAd from "../components/AdDetail/DetailAd";
import DetailUser from "../components/AdDetail/DetailUser";

export default function Ad() {
  const { adId } = useParams<{ adId: string }>();

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
        direction="row"
        spacing={4}
        sx={{
          width: "63rem",
          margin: "2rem auto",
        }}
      >
        <Stack
          sx={{
            backgroundColor: "var(--white)",
            borderRadius: "1rem",
            width: "34%",
          }}
        >
          <DetailUser ad={ad} />
        </Stack>
        <Stack
          sx={{
            backgroundColor: "var(--white)",
            borderRadius: "1rem",
            width: "64%",
          }}
        >
          <DetailAd ad={ad} />
        </Stack>
      </Stack>
    </>
  );
}
