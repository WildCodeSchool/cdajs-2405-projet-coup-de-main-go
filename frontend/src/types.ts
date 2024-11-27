export type Skill = {
  id: string;
  name: string;
  picture: string;
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
