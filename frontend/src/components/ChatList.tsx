import { useMutation } from "@apollo/client";
import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import ChatListContainer from "./ChatListContainer";
import { GET_USER_CHATS } from "../graphql/chatQueries";
import { MARK_MESSAGES_AS_READ_FOR_USER } from "../graphql/messageMutations";
import type { Chat } from "../types";

type ChatListProps = {
  chats: Chat[];
  userId: string;
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | undefined;
  isMobile: boolean;
};

export default function ChatList({
  chats,
  userId,
  onSelectChat,
  selectedChatId,
  isMobile,
}: ChatListProps) {
  const [markMessagesAsReadForUser] = useMutation(
    MARK_MESSAGES_AS_READ_FOR_USER,
    {
      refetchQueries: [{ query: GET_USER_CHATS, variables: { userId } }],
    }
  );

  const [initialSelectionMade, setInitialSelectionMade] = useState(false);

  const sortedChats = [...chats].sort((chatA, chatB) => {
    const dateA = new Date(chatA.messages.slice(-1)[0]?.date || 0);
    const dateB = new Date(chatB.messages.slice(-1)[0]?.date || 0);
    return dateB.getTime() - dateA.getTime();
  });

  useEffect(() => {
    if (!initialSelectionMade && sortedChats.length > 0 && !isMobile) {
      onSelectChat(sortedChats[0].id);
      setInitialSelectionMade(true);
    }
  }, [sortedChats, initialSelectionMade, onSelectChat, isMobile]);

  const handleChatSelection = async (chatId: string) => {
    const selectedChat = sortedChats.find((chat) => chat.id === chatId);
    if (!selectedChat) return;

    const unreadMessages = getUnreadMessagesCount(selectedChat, userId);
    onSelectChat(chatId);

    if (unreadMessages > 0) {
      try {
        await markMessagesAsReadForUser({ variables: { chatId, userId } });
      } catch (error) {
        console.error("Erreur lors de la mise à jour des messages :", error);
      }
    }
  };

  const getUnreadMessagesCount = (chat: Chat, userId: string) => {
    return chat.messages.filter(
      (msg) =>
        (msg.authorId !== userId &&
          !msg.isViewedByRequester &&
          chat.userRequester.id === userId) ||
        (msg.authorId !== userId &&
          !msg.isViewedByHelper &&
          chat.userHelper.id === userId)
    ).length;
  };

  return (
    <Paper sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <ChatListHeader title="Discussions" />
      <ChatListContainer
        chats={sortedChats}
        userId={userId}
        onSelectChat={handleChatSelection}
        selectedChatId={selectedChatId}
        getUnreadMessagesCount={getUnreadMessagesCount}
      />
    </Paper>
  );
}
