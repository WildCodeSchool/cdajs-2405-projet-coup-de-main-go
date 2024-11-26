import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
  mutation SendMessage($messageData: MessageInput!) {
    sendMessage(messageData: $messageData) {
      id
      message
      date
      isView
      author {
        id
        firstName
        lastName
        picture
      }
    }
  }
`;
