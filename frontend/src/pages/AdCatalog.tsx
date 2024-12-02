import { useGetAllAdsQuery } from "../generated/graphql-types.ts";
import type { AdCardType } from "../types.ts";
import AdCard from "../components/AdCatalog/AdCard.tsx";

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
      <ul>
        {adCards.map((ad: AdCardType) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </ul>
    </>
  );
}
