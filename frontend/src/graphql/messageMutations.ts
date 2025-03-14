import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
  mutation SendMessage($messageData: MessageInput!, $currentUserId: String!) {
    sendMessage(messageData: $messageData, currentUserId: $currentUserId) {
      id
      message
      date
      isViewedByRequester
      isViewedByHelper
      author {
        id
        firstName
        lastName
        picture
      }
    }
  }
`;

export const MARK_MESSAGES_AS_READ_FOR_USER = gql`
  mutation MarkMessagesAsReadForUser($chatId: String!, $userId: String!) {
    markMessagesAsReadForUser(chatId: $chatId, userId: $userId)
  }
`;
