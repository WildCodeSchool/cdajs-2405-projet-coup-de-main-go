import { useGetAllAdsQuery } from "../generated/graphql-types.ts";
import type { AdCardType } from "../types.ts";
import AdCard from "../components/AdCatalog/AdCard.tsx";
import { Stack } from "@mui/material";

export default function AdCatalog() {
  const {
    loading: adsLoading,
    error: adsError,
    data: adsData,
  } = useGetAllAdsQuery();

  if (adsLoading) return <p>Loading...</p>;
  if (adsError) return <p>Error: {adsError.message}</p>;

  const adCards: AdCardType[] = adsData!.getAllAds;

  return (
    <>
      <h1>Catalogue des annonces</h1>
      <Stack
        spacing="50px"
        direction="row"
        useFlexGap
        sx={{
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {adCards.map((ad: AdCardType) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </Stack>
    </>
  );
}
