import { Box, Container, Paper, Typography } from "@mui/material";
import { useState } from "react";
import ChatList from "../components/ChatList";
import ChatConversation from "../components/ChatConversation";
import { useUser } from "../contexts/UserContext";

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { userId } = useUser();

  if (!userId) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Messages
      </Typography>
      <Paper elevation={3}>
        <Box sx={{ display: "flex", height: "calc(100vh - 200px)" }}>
          <Box sx={{ width: "350px", borderRight: 1, borderColor: "divider" }}>
            <ChatList userId={userId} onSelectChat={setSelectedChatId} />
          </Box>
          <Box sx={{ flex: 1, display: "flex", alignItems: "stretch" }}>
            {!selectedChatId ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography color="textSecondary">
                  Sélectionnez une conversation pour commencer
                </Typography>
              </Box>
            ) : (
              <ChatConversation
                chatId={selectedChatId}
                currentUserId={userId}
              />
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
