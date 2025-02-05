import { MockedResponse } from "@apollo/client/testing";
import { GET_USER_OVERVIEW_BY_ID, USER_LOGIN_QUERY } from "../../../graphql/users";

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
          },
          reviewsAsHelperCount: 10,
          averageRating: 4.8,
        },
      },
    },
  },
];
