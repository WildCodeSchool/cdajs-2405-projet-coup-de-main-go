import { MockedResponse } from "@apollo/client/testing";
import {
  GET_AD_BY_ID_QUERY,
  GET_ADS_BY_USER_QUERY,
} from "../../../graphql/adQueries";
import { Status } from "../../../generated/graphql-types";
import { vi } from "vitest";
import { DELETE_AD } from "../../../graphql/adMutations";

export const mockUserId = "user-123";

export const mockAuth = {
  isAuthenticated: true,
  userId: "user-123",
  setIsAuthenticated: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
};

export const deleteAdMocks: MockedResponse[] = [
  // Mock pour la requête initiale GET_ADS_BY_USER_QUERY
  {
    request: {
      query: GET_ADS_BY_USER_QUERY,
      variables: {
        userId: mockUserId,
        status: Status.Posted,
      },
    },
    result: {
      data: {
        getAdsByUser: [
          {
            id: "1",
            title: "Ad1-title",
            description: "Ad1-description",
            updatedAt: "2025-05-05 10:23:20.837",
            mangoAmount: 2,
            status: Status.Posted,
            picture1: "",
            skill: {
              id: "1",
              name: "Skill1",
              picture: "url",
            },
            userRequester: {
              id: mockUserId,
              picture: "",
            },
          },
        ],
      },
    },
  },
  // Mock pour la requête GET_AD_BY_ID_QUERY
  {
    request: {
      query: GET_AD_BY_ID_QUERY,
      variables: {
        id: "1",
      },
    },
    result: {
      data: {
        getAdById: [
          {
            id: "1",
            title: "Ad1-title",
            updatedAt: "2025-05-05 10:23:20.837",
            mangoAmount: 2,
            description: "Ad1-description",
            duration: 60,
            longitude: "4.870536",
            latitude: "45.744393",
            status: Status.Posted,
            address: "1 rue de la Paix",
            zipCode: "69001",
            city: "Lyon",
            picture1: "",
            picture2: "",
            picture3: "",
            skill: {
              id: "1",
              name: "Skill1",
            },
            userRequester: {
              id: mockUserId,
              firstName: "myFirtName",
              lastName: "myLastName",
              picture: "",
              biography: "myBiography",
            },
          },
        ],
      },
    },
  },
  // Mock pour la mutation DELETE_AD
  {
    request: {
      query: DELETE_AD,
      variables: {
        id: "1",
        userRequesterId: mockUserId,
      },
    },
    result: {
      data: {
        deleteAd: [
          {
            deleteAd: true,
          },
        ],
      },
    },
  },
  // Mock pour la requête de refetch après la suppression
  {
    request: {
      query: GET_ADS_BY_USER_QUERY,
      variables: {
        userId: mockUserId,
        status: Status.Posted,
      },
    },
    result: {
      data: {
        getAdsByUser: [], // Renvoie une liste vide après la suppression
      },
    },
  },
];
