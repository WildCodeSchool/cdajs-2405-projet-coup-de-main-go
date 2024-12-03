import { Status } from "./generated/graphql-types";

export type AdCardType = {
  id: string;
  title: string;
  description: string;
  updatedAt: Date;
  mangoAmount: number;
  status: Status;
  skill: Skill;
  userRequester: UserRequester;
};

export type UserRequester = {
  id: string;
  picture?: string | null;
};

export type Skill = {
  id: string;
  name: string;
  picture: string;
};
