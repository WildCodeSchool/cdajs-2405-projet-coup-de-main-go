import { useGetAllAdsQuery } from "../generated/graphql-types";
import type { AdCardType } from "../types";
import AdCard from "./AdCard.tsx";

export default function Ads() {
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
      <ul>
        {adCards.map((ad: AdCardType) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </ul>
    </>
  );
}
