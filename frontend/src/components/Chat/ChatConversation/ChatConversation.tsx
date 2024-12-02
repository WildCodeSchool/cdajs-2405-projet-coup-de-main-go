import { Paper } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { GET_USER_CHATS } from "../../../graphql/chatQueries";
import { Chat } from "../../../types";
import type { MessageForm, Message, User } from "../../../types";
import { Status } from "../../../types";
import ChatConversationHeader from "./ChatConversationHeader";
import { ChatMessageList } from "../ChatMessage/ChatMessageList";
import { ChatActionButton } from "../ChatActionButton";
import { ChatInput } from "../ChatInput";
import ChatConversationMobileBanner from "./ChatConversationMobileBanner";
import {
  useSendMessageMutation,
  useUpdateAdStatusMutation,
  useUpdateChatHelpProposalMutation,
} from "../../../generated/graphql-types";

type ChatConversationProps = {
  chats: Chat[];
  chatId?: string;
  currentUserId: string;
  isMobile: boolean;
  onBack?: () => void;
  onOpenModal?: () => void;
};

export default function ChatConversation({
  chats,
  chatId,
  currentUserId,
  isMobile,
  onBack,
  onOpenModal,
}: ChatConversationProps) {
  const [messageInput, setMessageInput] = useState<string>("");
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [messageCount, setMessageCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displayedMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [displayedMessages]);

  const { handleSubmit, reset, setValue } = useForm<MessageForm>();

  const [sendMessage] = useSendMessageMutation({
    refetchQueries: [
      { query: GET_USER_CHATS, variables: { userId: currentUserId } },
    ],
  });

  const [updateAdStatus] = useUpdateAdStatusMutation({
    refetchQueries: [
      { query: GET_USER_CHATS, variables: { userId: currentUserId } },
    ],
  });

  const handleStatusChange = async (newStatus: Status) => {
    try {
      await updateAdStatus({
        variables: { id: currentChat!.ad.id, status: newStatus },
      });
    } catch (error) {
      console.error("Erreur lors du changement de statut de l'annonce:", error);
    }
  };

  const [updateChatHelpProposal] = useUpdateChatHelpProposalMutation({
    refetchQueries: [
      { query: GET_USER_CHATS, variables: { userId: currentUserId } },
    ],
  });

  const currentChat = chats.find((chat: Chat) => chat.id === chatId);

  const isRequester = currentUserId === currentChat?.userRequester.id;

  const handleProposeHelp = () => {
    updateChatHelpProposal({
      variables: { chatId: chatId!, isHelpProposed: true },
    });
  };

  const handleAcceptHelp = () => {
    handleStatusChange(Status.BOOKED);
  };

  const handleCancelHelp = () => {
    handleStatusChange(Status.POSTED);
    updateChatHelpProposal({
      variables: { chatId: chatId!, isHelpProposed: false },
    });
  };

  const handleFinalisedlHelp = () => {
    handleStatusChange(Status.FINALISED);
  };

  const getActionButtonProps = () => {
    // If the help has not been proposed yet, the requester can propose help
    if (!currentChat?.isHelpProposed) {
      return isRequester
        ? []
        : [{ label: "Proposer mon aide", onClick: handleProposeHelp }];
    }

    // If the help has been proposed, the requester can accept or refuse the help
    switch (status) {
      case Status.POSTED:
        return isRequester
          ? [
              {
                label: "Refuser l'aide",
                onClick: handleCancelHelp,
                variant: "outlined" as const,
              },
              { label: "Accepter l'aide", onClick: handleAcceptHelp },
            ]
          : [
              {
                label: "En attente d'acceptation",
                onClick: () => {},
                disabled: true,
              },
            ];
      case Status.BOOKED:
        return isRequester
          ? [
              {
                label: "Annuler ma demande d'aide",
                onClick: handleCancelHelp,
                variant: "outlined" as const,
              },
              {
                label: "Valider l'aide réalisée",
                onClick: handleFinalisedlHelp,
              },
            ]
          : [{ label: "Annuler l'aide", onClick: handleCancelHelp }];
      case Status.FINALISED:
        return [{ label: "Terminé", onClick: () => {}, disabled: true }];
      default:
        return [{ label: "Indisponible", onClick: () => {}, disabled: true }];
    }
  };

  useEffect(() => {
    if (currentChat) {
      const otherUserId =
        currentUserId === currentChat.userRequester.id
          ? currentChat.userHelper
          : currentChat.userRequester;

      setOtherUser({
        id: otherUserId.id,
        createdAt: otherUserId.createdAt,
        picture: otherUserId.picture || "",
        firstName: otherUserId.firstName,
        lastName: otherUserId.lastName,
      });

      const adStatus = currentChat.ad.status.toLowerCase() as Status;
      setStatus(adStatus);

      if (currentChat?.messages) {
        const lastMessages = currentChat.messages.slice(-messageCount);
        setDisplayedMessages(lastMessages);
      }
    }
  }, [currentChat, messageCount, currentUserId]);

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
            chatId: chatId!,
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
      {isMobile && otherUser && (
        <ChatConversationMobileBanner
          otherUser={{
            picture: otherUser.picture || "",
            firstName: otherUser.firstName,
            lastName: otherUser.lastName,
          }}
          onBack={onBack}
          onOpenModal={onOpenModal}
        />
      )}
      {otherUser && otherUser.createdAt && (
        <ChatConversationHeader userRegistrationDate={otherUser.createdAt} />
      )}

      <ChatMessageList
        messages={displayedMessages}
        isLoading={isLoading}
        currentUserId={currentUserId}
        messagesEndRef={messagesEndRef}
        onScroll={handleScroll}
      />
      <ChatActionButton actions={getActionButtonProps()} />
      <ChatInput
        value={messageInput}
        onChange={handleInputChange}
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
      />
    </Paper>
  );
}
