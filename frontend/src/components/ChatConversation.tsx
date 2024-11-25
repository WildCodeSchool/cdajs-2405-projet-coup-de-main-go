import { Box, TextField, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import ChatMessage from './ChatMessage';
import { useQuery } from '@apollo/client';
import { GET_USER_CHATS } from '../graphql/chatQueries';
import { Chat } from '../types';
import type { ChatConversationProps, MessageForm, Message } from '../types';

export default function ChatConversation({ chatId, currentUserId }: ChatConversationProps) {
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const { data, loading } = useQuery(GET_USER_CHATS, {
    variables: { userId: currentUserId },
  });

  const currentChat = data?.getChatsByUserId.find((chat: Chat) => chat.id === chatId);

  console.log(currentChat);
  

  const onSubmit = (formData: MessageForm) => {
    // TODO: Implement send message mutation
    console.log(formData);
    reset();
  };

  if (loading || !currentChat) return null;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
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
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          gap: 1,
        }}
      >
        <TextField
          {...register('message', { required: true })}
          fullWidth
          placeholder="Écrivez votre message..."
          variant="outlined"
          size="small"
        />
        <IconButton type="submit" color="primary">
          <Send />
        </IconButton>
      </Box>
    </Box>
  );
};