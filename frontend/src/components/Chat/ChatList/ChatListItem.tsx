import {
  Avatar,
  Badge,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Chat } from "../../../types";
import ChatListLastMessage from "./ChatListLastMessage";
import { formatFullName } from "../../../utils/formatName";
import { useTheme } from "@mui/material/styles";

type ChatListItemProps = {
  chat: Chat;
  userId: string;
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | undefined;
  unreadMessages: number;
};

export default function ChatListItem({
  chat,
  userId,
  onSelectChat,
  selectedChatId,
  unreadMessages,
}: ChatListItemProps) {
  const theme = useTheme();

  const otherUser =
    chat.userHelper.id === userId ? chat.userRequester : chat.userHelper;
  const lastMessage = chat.messages.slice(-1)[0];

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => onSelectChat(chat.id)}
        sx={{
          position: "relative",
          backgroundColor:
            chat.id === selectedChatId ? theme.palette.secondary.light : "inherit",
          "&:hover": {
            backgroundColor:
              chat.id === selectedChatId
                ? theme.palette.secondary.main
                : "action.hover",
          },
        }}
      >
        <ListItemAvatar>
          <Avatar
            src={`${import.meta.env.VITE_DOMAIN_BACKEND_URL}/uploads/users/${otherUser.id}/${otherUser.picture}`}
            alt={formatFullName(otherUser.firstName, otherUser.lastName)}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {formatFullName(otherUser.firstName, otherUser.lastName)}
              </Typography>
              <Badge
                color="warning"
                badgeContent={unreadMessages}
                invisible={unreadMessages === 0}
                sx={{
                  position: "absolute",
                  top: 24,
                  right: 24,
                }}
              />
            </Box>
          }
          secondary={
            <ChatListLastMessage
              message={lastMessage?.message}
              date={lastMessage?.date}
              unreadMessages={unreadMessages}
            />
          }
        />
      </ListItemButton>
    </ListItem>
  );
}
