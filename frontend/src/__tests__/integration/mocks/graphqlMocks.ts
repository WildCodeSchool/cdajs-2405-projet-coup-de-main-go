import { MockedResponse } from "@apollo/client/testing";
import {
    GET_USER_OVERVIEW_BY_ID,
    USER_LOGIN_QUERY,
} from "../../../graphql/users";
import {
    GET_CHAT_BY_USER_AND_AD_ID,
    GET_USER_CHATS,
} from "../../../graphql/chatQueries";
import { SEND_MESSAGE } from "../../../graphql/messageMutations";
import { StatusType } from "../../../types";
import jwt from "jsonwebtoken";

const mockUserId = "user-123";
const mockOtherUserId = "user-456";
const mockChatId = "chat-123";
const mockAdId = "ad-123";
const testMessage = "Voici un message de test";

const mockChat = {
    id: mockChatId,
    date: new Date().toISOString(),
    isHelpProposed: true,
    messages: [
        {
            id: "msg-1",
            message: "Bonjour, j'aimerais de l'aide pour mon ordinateur.",
            date: new Date().toISOString(),
            isViewedByRequester: true,
            isViewedByHelper: true,
            author: {
                id: mockUserId,
                firstName: "Jean",
                lastName: "Dupont",
                picture: "https://example.com/pic.jpg",
            },
        },
    ],
    ad: {
        id: mockAdId,
        title: "Aide informatique",
        description: "Je cherche de l'aide en informatique",
        mangoAmount: 50,
        duration: 60,
        status: StatusType.POSTED,
        picture1: "",
        picture2: "",
        picture3: "",
        skill: {
            id: "skill-1",
            name: "Informatique",
            picture: "",
        },
    },
    userHelper: {
        id: mockUserId,
        firstName: "Jean",
        lastName: "Dupont",
        picture: "https://example.com/pic.jpg",
        createdAt: new Date().toISOString(),
    },
    userRequester: {
        id: mockOtherUserId,
        firstName: "Joe",
        lastName: "Doe",
        picture: "https://example.com/pic2.jpg",
        createdAt: new Date().toISOString(),
    },
};

const jwtSecret: string | undefined = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("invalid JWT secret");
}

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
                    token: jwt.sign(
                        { email: "test@example.com", id: mockUserId },
                        jwtSecret
                    ),
                    userId: mockUserId,
                },
            },
        },
    },
    {
        request: {
            query: GET_USER_OVERVIEW_BY_ID,
            variables: {
                id: mockUserId,
            },
        },
        result: {
            data: {
                getUserOverviewById: {
                    user: {
                        firstName: "Jean",
                        lastName: "Dupont",
                        picture: "https://example.com/pic.jpg",
                        biography: "Passionné d'aide aux autres",
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
                userId: mockUserId,
            },
        },
        result: {
            data: {
                getChatsByUserId: [mockChat],
            },
        },
    },
    {
        request: {
            query: GET_CHAT_BY_USER_AND_AD_ID,
            variables: {
                userId: mockUserId,
                adId: mockAdId,
            },
        },
        result: {
            data: {
                getChatByUserAndAdId: mockChat,
            },
        },
    },
    {
        request: {
            query: SEND_MESSAGE,
            variables: {
                messageData: {
                    message: testMessage,
                    chatId: mockChatId,
                    authorId: mockUserId,
                    isViewedByRequester: false,
                    isViewedByHelper: false,
                },
                currentUserId: mockUserId,
            },
        },
        result: {
            data: {
                sendMessage: {
                    id: "new-msg-id",
                    message: testMessage,
                    date: new Date().toISOString(),
                    isViewedByRequester: false,
                    isViewedByHelper: false,
                    author: {
                        id: mockUserId,
                        firstName: "Jean",
                        lastName: "Dupont",
                        picture: "https://example.com/pic.jpg",
                    },
                },
            },
        },
    },
    {
        request: {
            query: GET_USER_CHATS,
            variables: {
                userId: mockUserId,
            },
        },
        result: {
            data: {
                getChatsByUserId: [
                    {
                        ...mockChat,
                        messages: [
                            ...mockChat.messages,
                            {
                                id: "new-msg-id",
                                message: testMessage,
                                date: new Date().toISOString(),
                                isViewedByRequester: false,
                                isViewedByHelper: false,
                                author: {
                                    id: mockUserId,
                                    firstName: "Jean",
                                    lastName: "Dupont",
                                    picture: "https://example.com/pic.jpg",
                                },
                            },
                        ],
                    },
                ],
            },
        },
    },
];

export const mockData = {
    userId: mockUserId,
    otherUserId: mockOtherUserId,
    chatId: mockChatId,
    adId: mockAdId,
    testMessage,
    chat: mockChat,
};
