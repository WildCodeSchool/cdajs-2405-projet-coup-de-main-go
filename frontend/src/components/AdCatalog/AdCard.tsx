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
        borderRadius: "20px",
        height: isMobile ? "324px" : "360px",
        width: "288px",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "10px 20px" : "20px",
        }}
      >
        <Stack direction="row" sx={{ alignItems: "center" }}>
          <Avatar
            src="/images/auth-modal-img.png"
            sx={{ width: "25px", height: "25px" }}
          />
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: isMobile ? "16px" : "26px",
              marginLeft: "5px",
            }}
          >
            {ad.skill.name}
          </Typography>
        </Stack>
        <Stack sx={{ alignSelf: "flex-start" }}>
          <Typography sx={{ color: "var(--text-tertiary)", fontSize: "12px" }}>
            {timeAgo}
          </Typography>
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
      <CardContent sx={{ height: "80px", padding: "25px" }}>
        <Typography>{ad.title}</Typography>
      </CardContent>

      {/* Footer */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ padding: "12px 25px" }}
      >
        <Stack direction="row">
          <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
            {ad.mangoAmount}
          </Typography>
          <img
            src="/images/Mango.png"
            alt="mango"
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
        </Stack>
        <Button
          component={Link}
          to={`/ad/${ad.id}`}
          sx={{
            backgroundColor: "var(--tertiary)",
            color: "var(--white)",
            textTransform: "none",
            textAlign: "center",
            lineHeight: "0.7rem",
            padding: "0.5rem 1rem",
            fontSize: "0.7rem",
            fontWeight: "bold",
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
