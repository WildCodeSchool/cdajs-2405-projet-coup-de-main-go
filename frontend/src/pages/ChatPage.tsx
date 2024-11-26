import { Box, Container } from "@mui/material";
import { useState } from "react";
import ChatList from "../components/ChatList";
import ChatConversation from "../components/ChatConversation";
import { useUser } from "../contexts/UserContext";
import ChatDetail from "../components/ChatDetail";

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    undefined
  );
  const { userId } = useUser();

  if (!userId) return null;

  return (
    <Container
      maxWidth="xl"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        py: 3,
        gap: 1,
        height: "80vh",
      }}
    >
      <Box
        sx={{
          flex: 0.25,
          minWidth: 0,
        }}
      >
        <ChatList userId={userId} onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
      </Box>
      <Box
        sx={{
          flex: 0.5,
          minWidth: 0,
        }}
      >
        <ChatConversation chatId={selectedChatId} currentUserId={userId} />
      </Box>
      <Box
        sx={{
          flex: 0.25,
          minWidth: 0,
        }}
      >
        <ChatDetail />
      </Box>
    </Container>
  );
}
