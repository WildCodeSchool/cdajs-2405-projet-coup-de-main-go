import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import ChatList from "../components/ChatList";
import ChatConversation from "../components/ChatConversation";
import { useUser } from "../contexts/UserContext";
import ChatDetail from "../components/ChatDetail";
import { GET_USER_CHATS } from "../graphql/chatQueries";

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    undefined
  );

  const { userId } = useUser();

  const { loading, error, data } = useQuery(GET_USER_CHATS, {
    variables: { userId },
  });

  if (!userId) return null;

  if (loading)
    return (
      <Box sx={{ p: 4 }}>
        <CircularProgress size={36} sx={{ color: "var(--secondary)" }} />
      </Box>
    );
  if (error)
    return (
      <Box sx={{ p: 4, display: "flex", alignItems: "center" }}>
        <Typography color="error">
          Erreur de chargement des conversations
        </Typography>
      </Box>
    );

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
      <Box sx={{ flex: 0.25, minWidth: 0 }}>
        <ChatList
          chats={data?.getChatsByUserId || []}
          userId={userId}
          onSelectChat={setSelectedChatId}
          selectedChatId={selectedChatId}
        />
      </Box>
      <Box sx={{ flex: 0.5, minWidth: 0 }}>
        <ChatConversation
          chats={data?.getChatsByUserId || []}
          chatId={selectedChatId}
          currentUserId={userId}
        />
      </Box>
      <Box sx={{ flex: 0.25, minWidth: 0 }}>
        <ChatDetail chats={data?.getChatsByUserId || []} chatId={selectedChatId} />
      </Box>
    </Container>
  );
}
