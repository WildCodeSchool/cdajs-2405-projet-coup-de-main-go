import {
  Box,
  TextField,
  IconButton,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@apollo/client";
import { GET_USER_CHATS } from "../graphql/chatQueries";
import ChatMessage from "./ChatMessage";
import { Chat } from "../types";
import type { ChatConversationProps, MessageForm, Message } from "../types";
import PersonIcon from "@mui/icons-material/Person";

export default function ChatConversation({
  chatId,
  currentUserId,
}: ChatConversationProps) {
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const { data, loading } = useQuery(GET_USER_CHATS, {
    variables: { userId: currentUserId },
  });

  const currentChat = data?.getChatsByUserId.find(
    (chat: Chat) => chat.id === chatId
  );

  const [messageInput, setMessageInput] = useState<string>("");

  const onSubmit = (formData: MessageForm) => {
    console.log(formData);
    setMessageInput("");
    reset();
  };

  if (loading || !currentChat) return null;

  return (
    <Paper
      elevation={3}
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box sx={{ p: 1, pl: 2, borderBottom: 3, borderColor: "divider" }}>
        <Typography variant="subtitle1" component="span" sx={{ ml: 1, fontWeight: "600" }}>
          À propos de ce membre
        </Typography>
        <Box sx={{ display: "flex" }}>
          <PersonIcon />
          <Typography variant="subtitle2" color="text.secondary">
            Membre depuis Septembre 2024
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 1,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {currentChat.messages.map((message: Message) => (
          <ChatMessage
            key={message.id}
            message={message.message}
            date={message.date}
            isCurrentUser={message.author.id === currentUserId}
            author={message.author}
          />
        ))}
      </Box>

      <Box
        sx={{ p: 1, display: "flex", borderBottom: 1, borderColor: "divider" }}
      >
        <Button
          variant="contained"
          sx={{
            margin: "auto",
            bgcolor: "var(--secondary)",
            "&:hover": {
              bgcolor: "var(--secondary-hover)",
            },
          }}
        >
          Proposer mon aide
        </Button>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          py: 1,
          px: 4,
          display: "flex",
          gap: 1,
        }}
      >
        <TextField
          {...register("message", { required: true })}
          fullWidth
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Entrez votre message..."
          variant="outlined"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "var(--secondary)",
              },
            },
          }}
        />
        <IconButton
          type="submit"
          sx={{
            color: "var(--secondary)",
            borderRadius: "20%",
            "&:hover": {
              bgcolor: "var(--secondary)",
              color: "var(--white)",
            },
          }}
        >
          <Send />
        </IconButton>
      </Box>
    </Paper>
  );
}