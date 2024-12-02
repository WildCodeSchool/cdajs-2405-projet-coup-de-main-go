import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import ChatList from "../components/Chat/ChatList/ChatList";
import ChatConversation from "../components/Chat/ChatConversation/ChatConversation";
import { useAuth } from "../contexts/AuthContext";
import ChatDetail from "../components/Chat/ChatDetail/ChatDetail";
import GenericModal from "../components/Modal/GenericModal";
import { useGetChatsByUserIdQuery } from "../generated/graphql-types";

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    undefined
  );
  const [view, setView] = useState<"list" | "conversation" | "detail">("list");
  const [modalOpen, setModalOpen] = useState(false);

  const { userId } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { loading, error, data } = useGetChatsByUserIdQuery({
    variables: { userId: userId! },
    pollInterval: import.meta.env.VITE_POLL_CHAT_INTERVAL || 60000,
  });
  useEffect(() => {
    if (isMobile) {
      setSelectedChatId(undefined);
      setView("list");
    }
  }, [isMobile]);

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
          Erreur lors du chargement des conversations
        </Typography>
      </Box>
    );

  const chats = data?.getChatsByUserId || [];

  const handleBack = () => {
    setSelectedChatId(undefined);
    setView("list");
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        py: 3,
        gap: 1,
        height: "85vh",
      }}
    >
      {isMobile ? (
        <>
          {view === "list" && (
            <Box sx={{ flex: 1 }}>
              {chats.length > 0 ? (
                <ChatList
                  chats={chats}
                  userId={userId}
                  onSelectChat={(chatId) => {
                    setSelectedChatId(chatId);
                    setView("conversation");
                  }}
                  selectedChatId={selectedChatId}
                  isMobile={isMobile}
                />
              ) : (
                <Box sx={{ display: "flex", justifyContent: "center", pt: 2  }}>
                  <Typography variant="h6" color="var(--secondary)">
                    Aucune conversation disponible
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          {view === "conversation" && (
            <Box sx={{ flex: 1, position: "relative" }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{ position: "absolute", top: 10, left: 10 }}
              >
                Retour
              </Button>
              <ChatConversation
                chats={chats}
                chatId={selectedChatId}
                currentUserId={userId}
                isMobile={isMobile}
                onBack={handleBack}
                onOpenModal={handleModalOpen}
              />
            </Box>
          )}
          <GenericModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            maxWidth="80%"
          >
            <ChatDetail chats={chats} chatId={selectedChatId} />
          </GenericModal>
        </>
      ) : (
        <>
          {chats.length > 0 ? (
            <>
              <Box sx={{ flex: 0.25, minWidth: 0 }}>
                <ChatList
                  chats={chats}
                  userId={userId}
                  onSelectChat={setSelectedChatId}
                  selectedChatId={selectedChatId}
                  isMobile={isMobile}
                />
              </Box>
              <Box sx={{ flex: 0.5, minWidth: 0 }}>
                <ChatConversation
                  chats={chats}
                  chatId={selectedChatId}
                  currentUserId={userId}
                  isMobile={isMobile}
                />
              </Box>
              <Box sx={{ flex: 0.25, minWidth: 0 }}>
                <ChatDetail chats={chats} chatId={selectedChatId} />
              </Box>
            </>
          ) : (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" color="var(--secondary)">
                Aucune conversation disponible
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
