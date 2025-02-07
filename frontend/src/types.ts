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
  picture1?: string | null;
};

export type UserRequester = {
  id: string;
  picture?: string | null;
};

export enum StatusType {
  POSTED = "posted",
  BOOKED = "booked",
  FINALISED = "finalised",
  ISREVIEWED = "isreviewed",
}

export type Skill = {
  id: string;
  name: string;
  picture: string;
};

export type AddressSuggestion = {
  properties: {
    label: string;
    name: string;
    postcode: string;
    city: string;
  };
  geometry: {
    coordinates: [number, number];
  };
  picture?: string | null;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  picture: string | null;
  skills?: Skill[];
  createdAt?: Date;
};

export type Ad = {
  id: string;
  title: string;
  description: string;
  picture1?: string | null;
  picture2?: string | null;
  picture3?: string | null;
  mangoAmount: number;
  duration: number;
  userRequester?: User;
  skill: Skill;
  status: Status;
};

export type Chat = {
  id: string;
  isHelpProposed: boolean;
  userRequester: User;
  userHelper: User;
  messages: Message[];
  ad: Ad;
};

export type Message = {
  id: string;
  message: string;
  date: string;
  isViewedByRequester: boolean;
  isViewedByHelper: boolean;
  authorId?: string;
  author?: User;
};

export type MessageForm = {
  message: string;
};
