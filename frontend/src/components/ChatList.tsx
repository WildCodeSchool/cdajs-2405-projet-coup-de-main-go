import { useQuery } from "@apollo/client";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { GET_USER_CHATS } from "../graphql/chatQueries";
import type { ChatListProps, Chat } from "../types";
import { useEffect } from "react";

export default function ChatList({ userId, onSelectChat }: ChatListProps) {
  const { loading, error, data } = useQuery(GET_USER_CHATS, {
    variables: { userId },
  });

  // Sort chats by last message date
  const sortedChats = [...(data?.getChatsByUserId || [])].sort(
    (chatA: Chat, chatB: Chat) => {
      const lastMessageA = chatA.messages[chatA.messages.length - 1];
      const lastMessageB = chatB.messages[chatB.messages.length - 1];

      // Check if last message exists
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
    if (sortedChats.length > 0) {
      onSelectChat(sortedChats[0].id);
    }
  }, [sortedChats, onSelectChat]);

  if (loading) return <Typography>Chargement...</Typography>;
  if (error)
    return (
      <Typography color="error">
        Erreur de chargement des conversations
      </Typography>
    );

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {sortedChats?.map((chat: Chat) => {
        const otherUser =
          chat.userHelper.id === userId ? chat.userRequester : chat.userHelper;
        const lastMessage = chat.messages[chat.messages.length - 1];

        return (
          <ListItem key={chat.id} disablePadding>
            <ListItemButton onClick={() => onSelectChat(chat.id)}>
              <ListItemAvatar>
                <Avatar
                  src={otherUser.picture}
                  alt={`${otherUser.firstName} ${otherUser.lastName}`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={`${otherUser.firstName} ${otherUser.lastName}`}
                secondary={
                  <Box
                    component="span"
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <Typography variant="body2" component="span" noWrap>
                      {lastMessage?.message || "Pas de message"}
                    </Typography>
                    <Typography variant="caption" component="span">
                      {lastMessage?.date &&
                        formatDistanceToNow(new Date(lastMessage.date), {
                          addSuffix: true,
                          locale: fr,
                        })}
                    </Typography>
                  </Box>
                }
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
