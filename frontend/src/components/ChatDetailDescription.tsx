import { Box, Typography } from "@mui/material";

type ChatDetailDescriptionProps = {
  ad?: {
    description: string;
  };
};

export default function ChatDetailDescription({
  ad,
}: ChatDetailDescriptionProps) {
  return (
    <Box
      sx={{
        p: 1,
        pl: 2,
        borderBottom: 2,
        borderColor: "divider",
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Description
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {ad?.description}
      </Typography>
    </Box>
  );
}
