import { MockedResponse } from "@apollo/client/testing";
import { GET_USER_OVERVIEW_BY_ID, USER_LOGIN_QUERY } from "../../../graphql/users";
import { GET_CHAT_BY_USER_AND_AD_ID, GET_USER_CHATS } from "../../../graphql/chatQueries";
import { SEND_MESSAGE } from "../../../graphql/messageMutations";

export const mocks: MockedResponse[] = [
  {
    request: {
      query: USER_LOGIN_QUERY,
      variables: {
        email: "test@example.com",
        password: "password123",
      },
    },
    result: {
      data: {
        login: {
          token: "fake-token-123",
          userId: "user-123",
        },
      },
    },
  },
  {
    request: {
      query: GET_USER_OVERVIEW_BY_ID,
      variables: {
        id: "user-123",
      },
    },
    result: {
      data: {
        getUserOverviewById: {
          user: {
            firstName: "John",
            lastName: "Doe",
            picture: "https://example.com/john-doe.jpg",
            biography: "Passionate about helping others.",
            mangoBalance: 100,
          },
          reviewsAsHelperCount: 10,
          averageRating: 4.8,
        },
      },
    },
  },
  {
    request: {
      query: USER_LOGIN_QUERY,
      variables: {
        email: "test@example.com",
        password: "password123",
      },
    },
    result: {
      data: {
        login: {
          token: "fake-token-123",
          userId: "user-123",
        },
      },
    },
  },
  {
    request: {
      query: GET_USER_OVERVIEW_BY_ID,
      variables: {
        id: "user-123",
      },
    },
    result: {
      data: {
        getUserOverviewById: {
          user: {
            firstName: "John",
            lastName: "Doe",
            picture: "https://example.com/john-doe.jpg",
            biography: "Passionate about helping others.",
            mangoBalance: 100,
          },
          reviewsAsHelperCount: 10,
          averageRating: 4.8,
        },
      },
    },
  },
  {
    request: {
      query: GET_USER_CHATS,
      variables: {
        userId: "user-123",
      },
    },
    result: {
      data: {
        getChatsByUserId: [
          {
            id: "chat-123",
            date: "2023-08-01T10:00:00.000Z",
            isHelpProposed: true,
            messages: [
              {
                id: "message-1",
                author: {
                  id: "user-456",
                  firstName: "Jane",
                  lastName: "Smith",
                  picture: "https://example.com/jane-smith.jpg",
                },
                date: "2023-08-01T10:10:00.000Z",
                isViewedByRequester: true,
                isViewedByHelper: true,
                message: "Bonjour, je peux vous aider avec votre ordinateur.",
              }
            ],
            ad: {
              id: "ad-123",
              title: "Aide pour réparation ordinateur",
              description: "J'ai besoin d'aide pour réparer mon ordinateur qui ne s'allume plus.",
              mangoAmount: 50,
              duration: 60,
              status: "POSTED",
              picture1: "https://example.com/pc-repair.jpg",
              picture2: null,
              picture3: null,
              skill: {
                id: "skill-1",
                name: "Informatique",
                picture: "https://example.com/computer-icon.jpg",
              },
            },
            userHelper: {
              id: "user-456",
              firstName: "Jane",
              lastName: "Smith",
              picture: "https://example.com/jane-smith.jpg",
              createdAt: "2023-01-01T00:00:00.000Z",
            },
            userRequester: {
              id: "user-123",
              firstName: "John",
              lastName: "Doe",
              picture: "https://example.com/john-doe.jpg",
              createdAt: "2023-01-15T00:00:00.000Z",
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: SEND_MESSAGE,
      variables: {
        messageData: {
          message: "Merci pour votre aide",
          chatId: "chat-123",
          authorId: "user-123",
          isViewedByRequester: false,
          isViewedByHelper: false,
        },
        currentUserId: "user-123",
      },
    },
    result: {
      data: {
        sendMessage: {
          id: "message-2",
          message: "Merci pour votre aide",
          date: "2023-08-01T10:20:00.000Z",
          isViewedByRequester: true,
          isViewedByHelper: false,
          author: {
            id: "user-123",
            firstName: "John",
            lastName: "Doe",
            picture: "https://example.com/john-doe.jpg",
          },
        },
      },
    },
  },
  {
    request: {
      query: GET_CHAT_BY_USER_AND_AD_ID,
      variables: {
        userId: "user-123",
        adId: "ad-123",
      },
    },
    result: {
      data: {
        getChatByUserAndAdId: {
          id: "chat-123",
          userHelper: {
            id: "user-456",
          },
          userRequester: {
            id: "user-123",
          },
          ad: {
            id: "ad-123",
          },
          isHelpProposed: true,
        },
      },
    },
  },
];
