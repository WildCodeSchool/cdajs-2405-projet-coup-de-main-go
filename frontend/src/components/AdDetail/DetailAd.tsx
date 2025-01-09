import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { GetAdByIdQuery } from "../../generated/graphql-types";
import { Link } from "react-router-dom";
import DetailAdSlider from "./DetailAdSlider";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import MapWithLocation from "./MapWithLocation";
import Hands from "/images/picture.png";
import theme from "../../mui";

interface DetailAdProps {
  ad: GetAdByIdQuery["getAdById"];
}

export default function DetailAd({ ad }: DetailAdProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
      return `${hours}h${minutes}`;
    }
  };

  const adWithPictures = Boolean(ad.picture1 || ad.picture2 || ad.picture3);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "14rem",
          borderRadius: "1rem 1rem 0 0",
        }}
      >
        {adWithPictures ? (
          <DetailAdSlider ad={ad} />
        ) : (
          <img
            src={Hands}
            alt="shaking hands"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              borderRadius: "1rem 1rem 0 0",
            }}
          />
        )}
      </Box>

      <Stack sx={{ padding: "0 1.5rem 2rem 1.5rem" }}>
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
        <Chip label={ad.skill.name} variant="outlined" sx={{ maxWidth: 128 }} />

        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
          spacing={isMobile ? 5 : 0}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{
              alignSelf: isMobile ? "flex-start" : "center",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              {ad.mangoAmount}
            </Typography>
            <img
              src="/images/mango.png"
              alt="mango"
              style={{ width: 20, height: 20 }}
            />
          </Stack>
          <Button
            component={Link}
            // TODO: A remplacer par le lien vers la page de chat
            to={"/dashboard"}
            sx={{
              px: 4,
              textAlign: "center",
            }}
          >
            Je propose mon aide
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
