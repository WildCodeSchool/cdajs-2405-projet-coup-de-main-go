import { Box, List } from "@mui/material";
import ChatListItem from "./ChatListItem";
import { Chat } from "../types";

type ChatListContainerProps = {
  chats: Chat[];
  userId: string;
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | undefined;
  getUnreadMessagesCount: (chat: Chat, userId: string) => number;
};

export default function ChatListContainer({
  chats,
  userId,
  onSelectChat,
  selectedChatId,
  getUnreadMessagesCount,
}: ChatListContainerProps) {
  return (
    <Box sx={{ flex: 1, overflow: "auto" }}>
      <List>
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            userId={userId}
            onSelectChat={onSelectChat}
            selectedChatId={selectedChatId}
            unreadMessages={getUnreadMessagesCount(chat, userId)}
          />
        ))}
      </List>
    </Box>
  );
}
