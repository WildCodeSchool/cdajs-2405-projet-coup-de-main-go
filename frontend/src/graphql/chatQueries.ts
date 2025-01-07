import { gql } from "@apollo/client";

export const GET_USER_CHATS = gql`
  query GetChatsByUserId($userId: String!) {
    getChatsByUserId(userId: $userId) {
      id
      date
      isHelpProposed
      messages {
        id
        author {
          id
          firstName
          lastName
          picture
        }
        date
        isViewedByRequester
        isViewedByHelper
        message
      }
      ad {
        id
        title
        description
        mangoAmount
        duration
        status
        picture1
        picture2
        picture3
        skill {
          id
          name
          picture
        }
      }
      userHelper {
        id
        firstName
        lastName
        picture
        createdAt
      }
      userRequester {
        id
        firstName
        lastName
        picture
        createdAt
      }
    }
  }
`;
