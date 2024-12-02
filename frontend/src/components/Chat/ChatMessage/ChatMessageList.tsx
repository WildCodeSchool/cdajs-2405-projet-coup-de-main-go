import { Box, CircularProgress } from "@mui/material";
import ChatMessage from "./ChatMessage";
import { Message } from "../../../types";

type ChatMessageListProps = {
  messages: Message[];
  isLoading: boolean;
  currentUserId: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
};

export function ChatMessageList({
  messages,
  isLoading,
  currentUserId,
  messagesEndRef,
  onScroll,
}: ChatMessageListProps) {
  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        p: 1,
        borderBottom: 1,
        borderColor: "divider",
      }}
      onScroll={onScroll}
    >
      {isLoading && (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <CircularProgress size={24} sx={{ color: "var(--secondary)" }} />
        </Box>
      )}
      {messages.map((message: Message) => (
        <ChatMessage
          key={message.id}
          message={message.message}
          date={message.date}
          isCurrentUser={message.author.id === currentUserId}
          author={message.author}
        />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
}
