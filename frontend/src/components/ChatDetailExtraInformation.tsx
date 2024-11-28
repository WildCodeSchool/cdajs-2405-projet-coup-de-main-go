import { Box, Typography } from "@mui/material";

type ChatDetailExtraInformationProps = {
  ad?: {
    duration: number;
  };
};

export default function ChatDetailExtraInformation({
  ad,
}: ChatDetailExtraInformationProps) {
  return (
    <Box sx={{ p: 1, pl: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Détails
      </Typography>
      <Box sx={{ pl: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Durée:
        </Typography>
        <Typography variant="body2">{ad?.duration}</Typography>
      </Box>
    </Box>
  );
}
