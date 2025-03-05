import { gql } from "@apollo/client";

export const CREATE_CHAT = gql`
  mutation CreateChat($chatData: ChatInput!) {
    createChat(chatData: $chatData) {
      id
      date
    }
  }
`;

export const UPDATE_CHAT_HELP_PROPOSAL = gql`
  mutation UpdateChatHelpProposal($chatId: String!, $isHelpProposed: Boolean!) {
    updateChatHelpProposal(chatId: $chatId, isHelpProposed: $isHelpProposed) {
      id
      isHelpProposed
    }
  }
`;
