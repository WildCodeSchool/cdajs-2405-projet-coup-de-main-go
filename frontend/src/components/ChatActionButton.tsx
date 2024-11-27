import { Box, Button } from "@mui/material";

export function ChatActionButton({label}: {label: string}) {
  return (
    <Box
      sx={{ p: 1, display: "flex", borderBottom: 1, borderColor: "divider" }}
    >
      <Button
        variant="contained"
        sx={{
          margin: "auto",
          bgcolor: "var(--secondary)",
          "&:hover": {
            bgcolor: "var(--secondary-hover)",
          },
        }}
      >
        {label}
      </Button>
    </Box>
  );
}
