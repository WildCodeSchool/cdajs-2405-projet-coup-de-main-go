import {
  Paper,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { GET_USER_CHATS } from "../graphql/chatQueries";
import { SEND_MESSAGE } from "../graphql/messageMutations";
import { Chat } from "../types";
import type { MessageForm, Message } from "../types";
import ChatConversationHeader from "./ChatConversationHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatActionButton } from "./ChatActionButton";
import { ChatInput } from "./ChatInput";

type ChatConversationProps = {
  chats: Chat[];
  chatId?: string;
  currentUserId: string;
};

export default function ChatConversation({
  chats,
  chatId,
  currentUserId,
}: ChatConversationProps) {
  const [messageInput, setMessageInput] = useState<string>("");
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [messageCount, setMessageCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displayedMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [displayedMessages]);

  const { handleSubmit, reset, setValue } = useForm<MessageForm>();

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    refetchQueries: [
      { query: GET_USER_CHATS, variables: { userId: currentUserId } },
    ],
  });

  const currentChat = chats.find((chat: Chat) => chat.id === chatId);

  useEffect(() => {
    if (currentChat?.messages) {
      const lastMessages = currentChat.messages.slice(-messageCount);
      setDisplayedMessages(lastMessages);
    }
  }, [currentChat, messageCount]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (
      scrollTop === 0 &&
      !isLoading &&
      currentChat &&
      currentChat.messages.length > displayedMessages.length
    ) {
      loadMoreMessages();
    }
  };

  // TODO: Implement pagination backend
  const loadMoreMessages = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMessageCount((prevCount) => prevCount + 10);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageInput(value);
    setValue("message", value);
  };

  const onSubmit = async (formData: MessageForm) => {
    try {
      await sendMessage({
        variables: {
          messageData: {
            message: formData.message,
            chatId: chatId,
            authorId: currentUserId,
            isViewedByRequester: false,
            isViewedByHelper: false,
          },
          currentUserId,
        },
      });

      setMessageInput("");
      reset();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <ChatConversationHeader userRegistrationDate="Septembre 2024" />
      <ChatMessageList
        messages={displayedMessages}
        isLoading={isLoading}
        currentUserId={currentUserId}
        messagesEndRef={messagesEndRef}
        onScroll={handleScroll}
      />
      <ChatActionButton label="Proposer mon aide" />
      <ChatInput
        value={messageInput}
        onChange={handleInputChange}
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
      />
    </Paper>
  );
}
