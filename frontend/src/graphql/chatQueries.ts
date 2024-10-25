import { gql } from "@apollo/client";

export const GET_USER_CHATS = gql`
  query GetChatsByUserId($userId: String!) {
    getChatsByUserId(userId: $userId) {
      id
      date
      messages {
        id
        author {
          id
          firstName
          lastName
          picture
        }
        chat {
          id
          date
        }
        date
        isView
        message
      }
      ad {
        id
        title
        description
      }
      userHelper {
        id
        firstName
        lastName
        picture
      }
      userRequester {
        id
        firstName
        lastName
        picture
      }
    }
  }
`;
