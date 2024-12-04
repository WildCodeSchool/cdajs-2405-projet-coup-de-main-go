import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import type { AdCardType } from "../../types";
import { Link } from "react-router-dom";
import theme from "../../mui";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface AdCardProps {
  ad: AdCardType;
}

export default function AdCard({ ad }: AdCardProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const timeAgo = formatDistanceToNow(new Date(ad.updatedAt), {
    locale: fr,
  });

  return (
    <Card
      key={ad.id}
      sx={{
        borderRadius: "1.25rem",
        height: isMobile ? "20.5rem" : "22.5rem",
        width: "18rem",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "0.6rem 1.25rem" : "1.25rem",
        }}
      >
        <Stack direction="row" sx={{ alignItems: "center" }}>
          <Avatar
            src="/images/auth-modal-img.png"
            sx={{ width: "1.5rem", height: "1.5rem" }}
          />
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: "bold",
              marginLeft: "0.03rem",
            }}
          >
            {ad.skill.name}
          </Typography>
        </Stack>
        <Stack
          sx={{
            alignSelf: "flex-start",
            justifySelf: "flex-end",
            marginLeft: "0.5rem",
            maxWidth: "5rem",
            textAlign: "right",
          }}
        >
          <Typography variant="message">{timeAgo}</Typography>
        </Stack>
      </Stack>

      {/* Image */}
      <CardMedia
        component="img"
        height="90px"
        image="/images/auth-modal-img.png"
        alt={`${ad.skill.name} picture`}
      />

      {/* Content */}
      <CardContent sx={{ height: "4.5rem", padding: "1.5rem" }}>
        <Typography
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {ad.description}
        </Typography>
      </CardContent>

      {/* Footer */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ padding: "0.75rem 1.5rem" }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography sx={{ fontWeight: "bold" }}>{ad.mangoAmount}</Typography>
          <img
            src="/images/Mango.png"
            alt="mango"
            style={{ width: "1.25rem", height: "1.25rem" }}
          />
        </Stack>
        <Button
          component={Link}
          color={"secondary"}
          to={`/ad/${ad.id}`}
          sx={{
            textAlign: "center",
            lineHeight: "1rem",
            padding: "0.5rem 1.25rem",
          }}
        >
          Plus
          <br />
          d'informations
        </Button>
      </Stack>
    </Card>
  );
}
