import { Avatar, Box, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";

interface MessageProps {
  message: string;
  date: string;
  isCurrentUser: boolean;
  author: {
    id: number;
    firstName: string;
    lastName: string;
    picture: string;
  };
}

export default function ChatMessage({
  message,
  date,
  isCurrentUser,
  author,
}: MessageProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    const calculateDistance = () => {
      const distance = formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: fr,
      });

      return distance.includes("environ 24 heures") ? "Il y a 1 jour" : distance;
    };

    setFormattedDate(calculateDistance());

    const interval = setInterval(() => {
      setFormattedDate(calculateDistance());
    }, 60000);

    return () => clearInterval(interval);
  }, [date]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isCurrentUser ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isCurrentUser ? "row-reverse" : "row",
          alignItems: "flex-end",
          maxWidth: "70%",
        }}
      >
        <Avatar
          src={`/uploads/users/${author.id}/${author.picture}`}
          alt={`${author.firstName} ${author.lastName}`}
          sx={{ width: 32, height: 32, mx: 1 }}
        />
        <Box>
          <Box
            sx={{
              bgcolor: isCurrentUser
                ? "var(--secondary)"
                : "var(--background-darker)",
              color: isCurrentUser ? "var(--white)" : "var(--text-primary)",
              p: 1,
              borderRadius: 2,
              maxWidth: "100%",
              wordBreak: "break-word",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="body1">{message}</Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: "block",
              textAlign: isCurrentUser ? "right" : "left",
              color: "var(--text-secondary)",
            }}
          >
            {formattedDate}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
