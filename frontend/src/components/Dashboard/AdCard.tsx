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
  console.log("adCards", ad);
  return (
    <Card
      key={ad.id}
      sx={{
        borderRadius: "1.25rem",
        //height: isMobile ? "20.5rem" : "22.5rem",
        height: "22.5rem",
        width: "18rem",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem",
          height: "2.5rem",
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Avatar
            src={
              ad.userRequester.picture
                ? `${import.meta.env.VITE_DOMAIN_BACKEND_URL}/uploads/users/${
                    ad.userRequester.id
                  }/${ad.userRequester.picture}`
                : "/images/auth-modal-img.png"
            }
            sx={{ width: "2rem", height: "2rem" }}
          />
          <Typography
            sx={{
              //marginLeft: "0.02rem",
              fontSize: isMobile ? "1.25rem" : "1.5rem",
              fontWeight: "500",
            }}
          >
            {ad.skill.name}
          </Typography>
        </Stack>
        <Stack
          sx={{
            alignSelf: "flex-start",
            justifySelf: "flex-end",
            maxWidth: "6rem",
            textAlign: "right",
          }}
        >
          <Typography variant="message">{timeAgo}</Typography>
        </Stack>
      </Stack>

      {/* Image */}
      <CardMedia
        component="img"
        height={120}
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
        image={
          ad.picture1
            ? `${import.meta.env.VITE_DOMAIN_BACKEND_URL}/uploads/ads/${
                ad.id
              }/${ad.picture1}`
            : "/images/picture.png"
        }
        alt={`${ad.skill.name} picture`}
      />

      {/* Content */}
      <CardContent sx={{ height: "4rem", padding: "1rem" }}>
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
            src="/images/mango.png"
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
            paddingY: 1,
            paddingX: 4,
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
