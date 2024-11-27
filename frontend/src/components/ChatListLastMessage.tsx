import { Box, Typography } from "@mui/material";
import { formatDurationToNow } from "../utils/date";

export default function ChatListLastMessage({
  message,
  date,
  unreadMessages,
}: {
  message?: string;
  date?: string;
  unreadMessages: number;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        variant="subtitle2"
        component="span"
        sx={{
          fontWeight: unreadMessages > 0 ? "bold" : "normal",
          mr: 2,
        }}
        noWrap
      >
        {message || "Pas de message"}
      </Typography>
      <Typography variant="caption" component="span">
        {date && formatDurationToNow(new Date(date))}
      </Typography>
    </Box>
  );
}
