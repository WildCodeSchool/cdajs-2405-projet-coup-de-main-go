import { MockedResponse } from "@apollo/client/testing";
import { GET_ALL_SKILLS_QUERY } from "../../../graphql/skillQueries";
import { vi } from "vitest";

export const mockAuth = {
  isAuthenticated: true,
  userId: "user-123",
  setIsAuthenticated: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
};

export const createAdMocks: MockedResponse[] = [
  {
    request: {
      query: GET_ALL_SKILLS_QUERY,
    },
    result: {
      data: {
        getAllSkills: [
          { id: "1", name: "Skill1", picture: "www.fakeurl.com" },
          { id: "2", name: "Skill2", picture: "www.fakeurl.com" },
        ],
      },
    },
  },
];
