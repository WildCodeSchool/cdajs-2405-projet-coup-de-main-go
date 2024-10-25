export type Skill = {
  id: string;
  name: string;
  picture: string;
};

export type ChatListProps = {
  chats: {
    __typename?: "Chat";
    id: string;
    date: Date;
    messages: {
      __typename?: "Message";
      id: string;
      date: Date;
      isView: boolean;
      message: string;
      author: {
        __typename?: "User";
        id: string;
        firstName: string;
        lastName: string;
        picture?: string | null;
      };
      chat: {
        id: string;
        date: string;
      };
    }[];
    ad: {
      id: string;
      title: string;
    };
    userHelper: {
      id: string;
      firstName: string;
      lastName: string;
      picture?: string | null;
    };

    userRequester: {
      id: string;
      firstName: string;
      lastName: string;
      picture?: string | null;
    };
  }[];
}