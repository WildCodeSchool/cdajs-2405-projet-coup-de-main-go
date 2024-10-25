import { gql } from "@apollo/client";

export const CREATE_CHAT = gql`
  mutation CreateChat($chatData: ChatInput!) {
    createChat(chatData: $chatData) {
      id
      date
    }
  }
`;
