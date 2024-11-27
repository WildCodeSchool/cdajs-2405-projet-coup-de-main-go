export type Skill = {
  id: string;
  name: string;
  picture: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  picture: string;
  skills?: Skill[];
};

export type Ad = {
  id: string;
  title: string;
  description: string;
  picture: string;
  userRequester: {
    id: string;
    firstName: string;
    lastName: string;
    picture: string;
  };
  skills: Skill[];
};

export type Chat = {
  id: string;
  userRequester: {
    id: string;
    firstName: string;
    lastName: string;
    picture: string;
  };
  userHelper: {
    id: string;
    firstName: string;
    lastName: string;
    picture: string;
  };
  messages: {
    id: string;
    message: string;
    date: string;
    isViewedByRequester: boolean;
    isViewedByHelper: boolean;
    authorId: string;
  }[];
  ad: Ad;
};

export type Message = {
  id: string;
  message: string;
  date: string;
  isViewedByRequester: boolean;
  isViewedByHelper: boolean;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    picture: string;
  };
};

export type MessageForm = {
  message: string;
};
