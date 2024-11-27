import { Box, Paper, Typography } from "@mui/material";
import ChatDetailProfile from "./ChatDetailProfile";
import { Chat, User } from "../types";
import { useEffect, useState } from "react";

type ChatDetailProps = {
  chats: Chat[];
  chatId?: string;
};

export default function ChatDetail({
  chats,
  chatId,
}: ChatDetailProps) {
   const [userHelper, setUserHelper] = useState<User | undefined>(undefined);
  
  const currentChat = chats.find((chat: Chat) => chat.id === chatId);

  useEffect(() => {
    if (currentChat?.userHelper) {
      setUserHelper(currentChat.userHelper);
    }
  }, [currentChat]);

  return (
    <Paper elevation={3} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <ChatDetailProfile userHelper={userHelper} />
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
          src="https://plus.unsplash.com/premium_photo-1680286739871-01142bc609df?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Jardinage"
          style={{
            width: 60,
            height: 60,
            marginRight: 2,
            borderRadius: 12,
          }}
        />
        <Box sx={{ ml: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Jardinage
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              10
            </Typography>
            <img src="./mango.png" alt="mango" style={{ width: 16 }} />
          </Box>
        </Box>
      </Box>

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
          J'aurais besoin d'aide pour mes plants de Tomates
        </Typography>
      </Box>

      <Box sx={{ p: 1, pl: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Détails
        </Typography>
        <Box sx={{ pl: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Durée:
          </Typography>
          <Typography variant="body2">1.30 heures</Typography>
        </Box>
      </Box>
    </Paper>
  );
}
