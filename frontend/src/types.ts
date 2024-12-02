export enum Status {
  POSTED = "posted",
  BOOKED = "booked",
  FINALISED = "finalised",
}

export type Skill = {
  id: string;
  name: string;
  picture?: string | null;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  picture?: string | null;
  skills?: Skill[];
  createdAt?: Date;
};

export type Ad = {
  id: string;
  title: string;
  description: string;
  picture?: string | null;
  mangoAmount: number;
  duration: number;
  userRequester?: User;
  skills?: Skill[];
  status: Status
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
