import { Box, Typography } from "@mui/material";
import { formatDurationToHours } from "../../../utils/duration";

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
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        Détails
      </Typography>
      <Box sx={{ pl: 1 }}>
        <Typography variant="body2">
          Durée:
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formatDurationToHours(ad?.duration)}
        </Typography>
      </Box>
    </Box>
  );
}
