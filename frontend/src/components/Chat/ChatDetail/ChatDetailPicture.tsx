import { Box, Typography } from "@mui/material";

type ChatDetailPictureProps = {
  ad?: {
    id: number;
    title: string;
    picture1: string | null;
    mangoAmount: number;
    skillId: number;
    skill?: {
      name: string;
      picture: string;
    };
  };
};

export default function ChatDetailPicture({ ad }: ChatDetailPictureProps) {
  const imageUrl = ad?.picture1
    ? `${import.meta.env.VITE_DOMAIN_BACKEND_URL}/uploads/ads/${ad?.id}/${
        ad?.picture1
      }`
    : `/images/skills/${ad?.skill?.picture}`;

  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "row",
        borderBottom: 2,
        borderColor: "divider",
      }}
    >
      <img
        src={imageUrl}
        alt={ad?.title}
        style={{
          width: 60,
          height: 60,
          marginRight: 2,
          borderRadius: 12,
        }}
      />
      <Box sx={{ ml: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {ad?.title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {ad?.mangoAmount}
          </Typography>
          <img src="/images/mango.png" alt="mango" style={{ width: 16 }} />
        </Box>
      </Box>
    </Box>
  );
}
