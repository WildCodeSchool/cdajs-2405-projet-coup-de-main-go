import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { formatDurationToNow } from "../../../utils/date";

export default function ChatListLastMessage({
  message,
  date,
  unreadMessages,
}: {
  message?: string;
  date?: string;
  unreadMessages: number;
}) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const calculateDistance = () => {
      if (!date) return "";

      const distance = formatDurationToNow(new Date(date));

      return distance;
    };
    setFormattedDate(calculateDistance());

    const interval = setInterval(() => {
      setFormattedDate(calculateDistance());
    }, 60000);

    return () => clearInterval(interval);
  }, [date, unreadMessages, message]);

  return (
    <Box
      component="span"
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
          fontWeight: unreadMessages > 0 ? 600 : 400,
          mr: 2,
          color: "black",
        }}
        noWrap
      >
        {message || "Pas de message"}
      </Typography>
      <Typography variant="caption" component="span">
        {formattedDate}
      </Typography>
    </Box>
  );
}
