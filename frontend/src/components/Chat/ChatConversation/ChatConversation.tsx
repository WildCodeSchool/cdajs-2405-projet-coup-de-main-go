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
import { Status } from "../../../types";
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
  const [messageCount, setMessageCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [hover, setHover] = useState(-1);

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

  const handleFinalisedHelp = () => {
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = () => {
    handleStatusChange(Status.ISREVIEWED);
    setReviewModalOpen(false);
  };

  const getActionButtonProps = (): ActionItem[] => {
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
      case Status.BOOKED:
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
      case Status.FINALISED:
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
      case Status.ISREVIEWED:
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

  const [createReview, { loading, error }] = useCreateReviewMutation({
    refetchQueries: [
      { query: GET_USER_CHATS, variables: { userId: currentUserId } },
    ],
  });

  const {
    handleSubmit: handleFormReviewSubmit,
    control,
    register,
    watch,
    reset: resetFormReviewSubmit,
    formState: { errors },
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
      <ChatInput
        value={messageInput}
        onChange={handleInputChange}
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
      />
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
                {...register("title", { required: true })}
                required
                fullWidth
                sx={{ marginBottom: "20px" }}
              />
              <TextField
                placeholder="Partage ici ton expérience"
                label="Commentaire (optionnel)"
                multiline
                rows={4}
                {...register("comment", {
                  maxLength: {
                    value: 10,
                    message:
                      "Le commentaire ne peut pas dépasser 10 caractères",
                  },
                })}
                error={!!errors.comment}
                helperText={errors.comment?.message}
                fullWidth
              />
              <Box
                sx={{
                  textAlign: "right",
                  marginBottom: "20px",
                  marginTop: "10px",
                }}
              >
                <Typography variant="caption">
                  {`${watch("comment")?.length || 0} / 10 caractères maximum`}
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
