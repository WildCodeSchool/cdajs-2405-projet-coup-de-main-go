import { Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { GetAdByIdQuery } from "../../generated/graphql-types";
import { Link } from "react-router-dom";
import DetailAdSlider from "./DetailAdSlider";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import MapWithLocation from "./MapWithLocation";

interface DetailAdProps {
  ad: GetAdByIdQuery["getAdById"];
}

export default function DetailAd({ ad }: DetailAdProps) {
  const timeAgo = formatDistanceToNow(new Date(ad.updatedAt), {
    locale: fr,
    addSuffix: true,
  });

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours === 0) {
      return `${minutes}min`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}min`;
    }
  };

  return (
    <>
      <DetailAdSlider />

      <Stack sx={{ padding: "0 1.5rem 1rem 1.5rem" }}>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography variant="h5" component="h1">
            {ad.title}
          </Typography>
          <Typography variant="message">{timeAgo}</Typography>
        </Stack>

        <Typography>{ad.description}</Typography>

        <Divider sx={{ width: "80%" }} />

        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Durée
        </Typography>
        <Typography>{formatDuration(ad.duration)}</Typography>

        <Divider sx={{ width: "80%" }} />

        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Localisation
        </Typography>
        {ad.latitude && ad.longitude ? (
          <MapWithLocation latitude={ad.latitude} longitude={ad.longitude} />
        ) : (
          <Typography>Carte non disponible</Typography>
        )}
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Compétence
        </Typography>
        <Chip
          label={ad.skill.name}
          variant="outlined"
          sx={{ maxWidth: "6rem" }}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ padding: "0.75rem 1.5rem" }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography sx={{ fontWeight: "bold" }}>
              {ad.mangoAmount}
            </Typography>
            <img
              src="/images/Mango.png"
              alt="mango"
              style={{ width: "1.25rem", height: "1.25rem" }}
            />
          </Stack>
          <Button
            component={Link}
            color={"primary"}
            // TODO: A remplacer par le lien vers la page de chat
            to={"/ads"}
            sx={{
              textAlign: "center",
              lineHeight: "1rem",
              padding: "0.5rem 1.25rem",
            }}
          >
            Je propose mon aide
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
