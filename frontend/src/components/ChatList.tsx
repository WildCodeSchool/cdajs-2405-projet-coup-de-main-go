import { useQuery, useMutation } from "@apollo/client";
import {
  Avatar,
  Badge,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { GET_USER_CHATS } from "../graphql/chatQueries";
import { MARK_MESSAGES_AS_READ_FOR_USER } from "../graphql/messageMutations";
import type { ChatListProps, Chat } from "../types";
import { useEffect, useState } from "react";
import { formatDurationToNow } from "../utils/date";
import { formatFullName } from "../utils/formatName";

export default function ChatList({
  userId,
  onSelectChat,
  selectedChatId,
}: ChatListProps & { selectedChatId: string | undefined }) {
  const { loading, error, data } = useQuery(GET_USER_CHATS, {
    variables: { userId },
  });

  const [markMessagesAsReadForUser] = useMutation(
    MARK_MESSAGES_AS_READ_FOR_USER,
    {
      refetchQueries: [{ query: GET_USER_CHATS, variables: { userId } }],
    }
  );

  const [initialSelectionMade, setInitialSelectionMade] = useState(false);

  // Sort chats by last message date
  const sortedChats = [...(data?.getChatsByUserId || [])].sort(
    (chatA: Chat, chatB: Chat) => {
      const lastMessageA = chatA.messages[chatA.messages.length - 1];
      const lastMessageB = chatB.messages[chatB.messages.length - 1];

      const dateA = lastMessageA?.date
        ? new Date(lastMessageA.date)
        : new Date(0);
      const dateB = lastMessageB?.date
        ? new Date(lastMessageB.date)
        : new Date(0);

      return dateB.getTime() - dateA.getTime();
    }
  );

  // Select first chat by default
  useEffect(() => {
    if (!initialSelectionMade && sortedChats.length > 0) {
      onSelectChat(sortedChats[1].id);
      setInitialSelectionMade(true);
    }
  }, [sortedChats, onSelectChat, initialSelectionMade, userId, markMessagesAsReadForUser]);

  const handleChatSelection = async (chatId: string) => {
    onSelectChat(chatId);
    try {
      await markMessagesAsReadForUser({ variables: { chatId, userId } });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des messages :", error);
    }
  };

  if (loading) return <Typography>Chargement...</Typography>;
  if (error)
    return (
      <Typography color="error">
        Erreur de chargement des conversations
      </Typography>
    );

  return (
    <Paper
      elevation={3}
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box sx={{ pl: 2, pt: 2 }}>
        <Typography variant="h6" component="h2">
          Discussions
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {sortedChats?.map((chat: Chat) => {
            const otherUser =
              chat.userHelper.id === userId
                ? chat.userRequester
                : chat.userHelper;

            const lastMessage = chat.messages[chat.messages.length - 1];
            const unreadMessages = chat.messages.filter((message) => {
              if (chat.userRequester.id === userId) {
                return (
                  !message.isViewedByRequester && message.authorId !== userId
                );
              } else if (chat.userHelper.id === userId) {
                return !message.isViewedByHelper && message.authorId !== userId;
              }
              return false;
            }).length;

            return (
              <ListItem key={chat.id} disablePadding>
                <ListItemButton
                  onClick={() => handleChatSelection(chat.id)}
                  sx={{
                    position: "relative",
                    backgroundColor:
                      chat.id === selectedChatId ? "var(--primary)" : "inherit",
                    "&:hover": {
                      backgroundColor:
                        chat.id === selectedChatId
                          ? "var(--primary-hover)"
                          : "action.hover",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={otherUser.picture}
                      alt={formatFullName(
                        otherUser.firstName,
                        otherUser.lastName
                      )}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        component="span"
                        sx={{
                          fontWeight: unreadMessages > 0 ? "bold" : "normal",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 500 }}
                        >
                          {formatFullName(
                            otherUser.firstName,
                            otherUser.lastName
                          )}
                        </Typography>

                        <Badge
                          color="warning"
                          badgeContent={unreadMessages}
                          invisible={unreadMessages === 0}
                          sx={{
                            mr: 1,
                            ml: "auto",
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box
                        component="span"
                        sx={{
                          fontWeight: unreadMessages > 0 ? "bold" : "normal",
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
                          {lastMessage?.message || "Pas de message"}
                        </Typography>
                        <Typography
                          variant="caption"
                          component="span"
                          sx={{
                            marginLeft: "auto",
                          }}
                        >
                          {lastMessage?.date &&
                            formatDurationToNow(new Date(lastMessage.date))}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Paper>
  );
}
