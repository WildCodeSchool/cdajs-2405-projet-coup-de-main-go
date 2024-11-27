import { Box, Typography } from "@mui/material";

export default function ChatHeader({ title }: { title: string }) {
  return (
    <Box sx={{ pl: 2, pt: 2 }}>
      <Typography variant="h6">{title}</Typography>
    </Box>
  );
}
