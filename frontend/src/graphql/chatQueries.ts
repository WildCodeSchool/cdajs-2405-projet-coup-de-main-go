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

export const GET_CHAT_BY_USER_AND_AD_ID = gql`
  query GetChatByUserAndAdId($userId: String!, $adId: String!) {
    getChatByUserAndAdId(userId: $userId, adId: $adId) {
      id
      userHelper {
        id
      }
      userRequester {
        id
      }
      ad {
        id
      }
      isHelpProposed
    }
  }
`;
