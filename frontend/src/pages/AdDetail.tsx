import { Stack, Typography } from "@mui/material";
import { Title } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useGetAdByIdQuery } from "../generated/graphql-types";

export default function AdDetail() {
  const { adId } = useParams<{ adId: string }>();

  if (!adId) {
    return <p>URL invalide</p>;
  }

  const {
    loading: adLoading,
    error: adError,
    data: adData,
  } = useGetAdByIdQuery({ variables: { id: adId } });

  if (adLoading) return <p>Loading...</p>;
  if (adError) return <p>Error: {adError.message}</p>;
  if (!adData) return <p>No data found</p>;

  const ad = adData!.getAdById;

  return (
    <>
      <Stack
        direction="row"
        spacing={4}
        sx={{ backgroundColor: "lightblue", width: "63rem", margin: "auto" }}
      >
        <Stack sx={{ backgroundColor: "pink", width: "34%" }}>user</Stack>
        <Stack sx={{ backgroundColor: "lightgreen", width: "64%" }}>ad</Stack>
      </Stack>

      {/* <Title>{ad.title}</Title>
      <Typography>Mangue(s) : {ad.mangoAmount}</Typography>
      <Typography>Statut de l'annonce : {ad.status}</Typography>
      <Typography>
        Dernière mise à jour :{new Date(ad.updatedAt).toLocaleDateString()}
      </Typography>
      <Typography>Compétence requise : {ad.skill.name}</Typography> */}
    </>
  );
}
