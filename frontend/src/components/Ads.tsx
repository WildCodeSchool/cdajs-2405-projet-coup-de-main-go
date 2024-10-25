import { useGetAllAdsQuery } from "../generated/graphql-types";
import type { AdCard } from "../types";

export default function Ads() {
  const {
    loading: adsLoading,
    error: adsError,
    data: adsData,
  } = useGetAllAdsQuery();

  if (adsLoading) return <p>Loading...</p>;
  if (adsError) return <p>Error: {adsError.message}</p>;

  const adCards: AdCard[] = adsData!.getAllAds;
  console.log(adCards);

  return (
    <>
      <h1>Catalogue des annonces</h1>
      <ul>
        {adCards.map((ad: AdCard) => (
          <li key={ad.id}>
            <p>Titre de l'annonce :{ad.title}</p>
            <p>Cout en mangues : {ad.mangoAmount} mangues</p>
            <p>Statut de l'annonce : {ad.status}</p>
            {/* Utiliser date-fns pour formater les dates */}
            <p>
              Dernière mise à jour :
              {new Date(ad.updatedAt).toLocaleDateString()}
            </p>
            <p>Compétence requise : {ad.skill.name}</p>
            {/* A intégrer : photos de l'utilisateur et de la compétence */}
          </li>
        ))}
      </ul>
    </>
  );
}
