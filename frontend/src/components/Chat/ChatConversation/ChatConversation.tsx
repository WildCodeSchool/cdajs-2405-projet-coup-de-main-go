import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { GET_USER_CHATS } from "../../../graphql/chatQueries";
import { Chat } from "../../../types";
import type { MessageForm, Message, User } from "../../../types";
import { StatusType } from "../../../types";
import ChatConversationHeader from "./ChatConversationHeader";
import { ChatMessageList } from "../ChatMessage/ChatMessageList";
import { ChatActionButton } from "../ChatActionButton";
import { ChatInput } from "../ChatInput";
import ChatConversationMobileBanner from "./ChatConversationMobileBanner";
import GenericModal from "../../Modal/GenericModal";
import {
  useSendMessageMutation,
  useUpdateAdStatusMutation,
  useUpdateChatHelpProposalMutation,
  useCreateReviewMutation,
} from "../../../generated/graphql-types";
import Rating from "@mui/material/Rating";

const labels: { [index: number]: string } = {
  0.5: "Très décevant",
  1: "Décevant",
  1.5: "Médiocre",
  2: "Pas terrible",
  2.5: "Moyen",
  3: "Satisfaisant",
  3.5: "Bien",
  4: "Très bien",
  4.5: "Excellent",
  5: "Parfait",
};

type ChatConversationProps = {
  chats: Chat[];
  chatId?: string;
  currentUserId: string;
  isMobile: boolean;
  onBack?: () => void;
  onOpenModal?: () => void;
};

type ReviewForm = {
  rating: number;
  title: string;
  comment?: string;
};

type ActionItem = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "contained" | "outlined";
  type?: "button" | "text";
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
  const [messageCount, setMessageCount] = useState(200);
  const [isLoading, setIsLoading] = useState(false);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [status, setStatus] = useState<StatusType | null>(null);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [hover, setHover] = useState(-1);
  const [commentLength, setCommentLength] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displayedMessages.length > 0) {
      setTimeout(() => {
        const chatContainer = messagesEndRef.current?.parentElement;
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
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

  const handleStatusChange = async (newStatus: StatusType) => {
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

  const handleAcceptHelp = () => {
    handleStatusChange(StatusType.BOOKED);
  };

  const handleCancelHelp = () => {
    handleStatusChange(StatusType.POSTED);
    updateChatHelpProposal({
      variables: { chatId: chatId!, isHelpProposed: false },
    });
  };

  const handleFinalisedlHelp = () => {
    handleStatusChange(StatusType.FINALISED);
  };

  const handleFinalisedHelp = () => {
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = () => {
    handleStatusChange(StatusType.ISREVIEWED);
    setReviewModalOpen(false);
  };

  const getActionButtonProps = (): ActionItem[] => {
    // If the help has not been proposed yet, the requester can propose help
    if (!currentChat?.isHelpProposed) {
      return isRequester
        ? []
        : [{ label: "Aide refusée", disabled: true, onClick: () => {} }];
    }

    // If the help has been proposed, the requester can accept or refuse the help
    switch (status) {
      case StatusType.POSTED:
        return isRequester
          ? [
              {
                label: "Refuser l'aide",
                onClick: handleCancelHelp,
                variant: "outlined",
              },
              { label: "Accepter l'aide", onClick: handleAcceptHelp },
            ]
          : [
              {
                label: "En attente d'acceptation",
                disabled: true,
                onClick: () => {},
              },
            ];
      case StatusType.BOOKED:
        return isRequester
          ? [
              {
                label: "Annuler ma demande d'aide",
                onClick: handleCancelHelp,
                variant: "outlined",
              },
              {
                label: "Valider l'aide réalisée",
                onClick: handleFinalisedlHelp,
              },
            ]
          : [{ label: "Annuler l'aide", onClick: handleCancelHelp }];
      case StatusType.FINALISED:
        return isRequester
          ? [
              {
                label: "Laissez une évaluation",
                onClick: handleFinalisedHelp,
              },
            ]
          : [
              {
                label:
                  "Merci pour votre contribution. En attente d'évaluation.",
                onClick: () => {},
                type: "text",
              },
            ];
      case StatusType.ISREVIEWED:
        return isRequester
          ? [
              {
                label: "Evaluation ajoutée. Merci pour votre contribution.",
                onClick: () => {},
                type: "text",
              },
            ]
          : [
              {
                label:
                  "Vous avez reçu une nouvelle évaluation. Merci pour votre contribution.",
                onClick: () => {},
                type: "text",
              },
            ];
      default:
        return [];
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

      const adStatus = currentChat.ad.status.toLowerCase() as StatusType;
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

  const [createReview, { loading, error }] = useCreateReviewMutation({
    refetchQueries: [
      { query: GET_USER_CHATS, variables: { userId: currentUserId } },
    ],
  });

  const {
    handleSubmit: handleFormReviewSubmit,
    control,
    register,
    reset: resetFormReviewSubmit,
  } = useForm<ReviewForm>();

  const onReviewFormSubmitted = async (data: {
    rating: number;
    title: string;
    comment?: string;
  }) => {
    const result = await createReview({
      variables: {
        reviewData: {
          rating: data.rating,
          title: data.title,
          comment: data.comment,
          userHelperId: currentChat!.userHelper.id,
          userRequesterId: currentChat!.userRequester.id,
        },
      },
    });
    if (result) handleReviewSubmit();
  };

  const handleCloseReviewModal = () => {
    resetFormReviewSubmit();
    setReviewModalOpen(false);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const length = event.target.value.length;
    setCommentLength(length);
  };

  const isHelpRefused =
    !currentChat?.isHelpProposed &&
    status === StatusType.POSTED &&
    !isRequester;

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        border: 0,
        borderRadius: "12px",
      }}
    >
      {isMobile && otherUser && (
        <ChatConversationMobileBanner
          otherUser={{
            id: parseInt(otherUser.id),
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
      {isHelpRefused ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
            backgroundColor: "tertiary.main",
            borderRadius: "12px",
            margin: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              alignSelf: "center",
              padding: "0 16px",
            }}
          >
            L'aide a été refusée. Vous ne pouvez plus envoyer de messages.
          </Typography>
        </Box>
      ) : (
        <ChatInput
          value={messageInput}
          onChange={handleInputChange}
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
        />
      )}
      <GenericModal
        open={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        maxWidth={isMobile ? "80%" : "50%"}
        bgColor="white"
        title="Laissez une évaluation"
      >
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            border: 0,
            borderRadius: "12px",
          }}
        >
          <form onSubmit={handleFormReviewSubmit(onReviewFormSubmitted)}>
            <Box
              component="fieldset"
              borderColor="transparent"
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Controller
                name="rating"
                control={control}
                defaultValue={5}
                rules={{ required: true }}
                render={({ field }) => (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <Rating
                      {...field}
                      name="hover-feedback"
                      precision={0.5}
                      size="large"
                      onChange={(_, newValue) => {
                        field.onChange(Number(newValue));
                      }}
                      onChangeActive={(_, newHover) => {
                        setHover(newHover);
                      }}
                    />
                    <Typography sx={{ ml: 2 }}>
                      {labels[hover !== -1 ? hover : field.value]}
                    </Typography>
                  </Box>
                )}
              />
              <TextField
                type="text"
                placeholder="Titre"
                label="Titre"
                {...register("title", { required: true, maxLength: 50 })}
                required
                fullWidth
                sx={{ marginBottom: "20px" }}
                slotProps={{ htmlInput: { maxLength: 50 } }}
              />
              <TextField
                placeholder="Partage ici ton expérience"
                label="Commentaire (optionnel)"
                multiline
                rows={4}
                {...register("comment", {
                  onChange: handleCommentChange,
                  maxLength: {
                    value: 200,
                    message:
                      "Le commentaire ne peut pas dépasser 200 caractères",
                  },
                })}
                error={commentLength > 200}
                helperText={
                  commentLength > 200
                    ? "Le commentaire ne peut pas dépasser 200 caractères"
                    : ""
                }
                fullWidth
              />
              <Box
                sx={{
                  textAlign: "right",
                  marginBottom: "20px",
                  marginTop: "10px",
                }}
              >
                <Typography
                  variant="caption"
                  color={commentLength > 200 ? "error" : "textSecondary"}
                >
                  {`${commentLength} / 200 caractères maximum`}
                </Typography>
              </Box>
              <Button type="submit" disabled={loading}>
                {loading ? "Envoi en cours..." : "Soumettre"}
              </Button>
            </Box>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box sx={{ color: "error.main", textAlign: "center", p: 1 }}>
                <Typography>
                  Une erreur est survenue: Veuillez réessayer plus tard.
                </Typography>
              </Box>
            ) : null}
          </form>
        </Paper>
      </GenericModal>
    </Paper>
  );
}
