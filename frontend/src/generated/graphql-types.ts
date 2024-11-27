import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
};

export type Ad = {
  __typename?: 'Ad';
  address: Scalars['String']['output'];
  chats: Array<Chat>;
  city: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  description: Scalars['String']['output'];
  duration: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  mangoAmount: Scalars['Float']['output'];
  picture1?: Maybe<Scalars['String']['output']>;
  picture2?: Maybe<Scalars['String']['output']>;
  picture3?: Maybe<Scalars['String']['output']>;
  skill: Skill;
  status: Status;
  title: Scalars['String']['output'];
  transaction: Transaction;
  updatedAt: Scalars['DateTimeISO']['output'];
  userRequester: User;
  zipCode: Scalars['String']['output'];
};

export type AdInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  description: Scalars['String']['input'];
  duration: Scalars['Int']['input'];
  mangoAmount: Scalars['Int']['input'];
  picture1?: InputMaybe<Scalars['String']['input']>;
  picture2?: InputMaybe<Scalars['String']['input']>;
  picture3?: InputMaybe<Scalars['String']['input']>;
  skillId: Scalars['String']['input'];
  title: Scalars['String']['input'];
  userRequesterId: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type Chat = {
  __typename?: 'Chat';
  ad: Ad;
  date: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  messages: Array<Message>;
  userHelper: User;
  userRequester: User;
};

export type ChatInput = {
  adId: Scalars["String"]["input"];
  userHelperId: Scalars["String"]["input"];
  userRequesterId: Scalars["String"]["input"];
};

export type Message = {
  __typename?: "Message";
  author: User;
  chat: Chat;
  date: Scalars["DateTimeISO"]["output"];
  id: Scalars["ID"]["output"];
  isView: Scalars["Boolean"]["output"];
  message: Scalars["String"]["output"];
};

export type MessageInput = {
  authorId: Scalars["String"]["input"];
  chatId: Scalars["String"]["input"];
  isView: Scalars["Boolean"]["input"];
  message: Scalars["String"]["input"];
};

export type Mutation = {
  __typename?: "Mutation";
  addTransaction: Transaction;
  changePassword: Scalars["Boolean"]["output"];
  createAd: Ad;
  createChat: Chat;
  createReview: Review;
  deleteAccount: Scalars["Boolean"]["output"];
  deleteAd: Scalars["Boolean"]["output"];
  register: User;
  sendMessage: Message;
  transferMango: Scalars["Float"]["output"];
  updateAd: Ad;
  updateUser: User;
};

export type MutationAddTransactionArgs = {
  transactionData: TransactionInput;
};

export type MutationChangePasswordArgs = {
  id: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type MutationCreateAdArgs = {
  adData: AdInput;
};

export type MutationCreateChatArgs = {
  chatData: ChatInput;
};

export type MutationCreateReviewArgs = {
  reviewData: ReviewInput;
};

export type MutationDeleteAccountArgs = {
  id: Scalars["String"]["input"];
};

export type MutationDeleteAdArgs = {
  id: Scalars["String"]["input"];
};

export type MutationRegisterArgs = {
  address: Scalars["String"]["input"];
  city: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  zipCode: Scalars["String"]["input"];
};

export type MutationSendMessageArgs = {
  messageData: MessageInput;
};

export type MutationTransferMangoArgs = {
  amount: Scalars["Float"]["input"];
  id: Scalars["String"]["input"];
};

export type MutationUpdateAdArgs = {
  adData: AdInput;
  id: Scalars["String"]["input"];
};

export type MutationUpdateUserArgs = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  biography?: InputMaybe<Scalars["String"]["input"]>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  dateOfBirth?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  firstName?: InputMaybe<Scalars["String"]["input"]>;
  gender?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["String"]["input"];
  lastName?: InputMaybe<Scalars["String"]["input"]>;
  picture?: InputMaybe<Scalars["String"]["input"]>;
  zipCode?: InputMaybe<Scalars["String"]["input"]>;
};

export type Query = {
  __typename?: "Query";
  getAdById: Ad;
  getAdsByUser: Array<Ad>;
  getAllAds: Array<Ad>;
  getAllSkills?: Maybe<Array<Skill>>;
  getAllUsers: Array<User>;
  getChatsByUserId?: Maybe<Array<Chat>>;
  getMangoBalanceByUserId: Scalars["Float"]["output"];
  getMessagesByChatId?: Maybe<Array<Message>>;
  getReviewsByUserHelperId?: Maybe<Array<Review>>;
  getTransactionsHistoryByUser?: Maybe<Array<Transaction>>;
  getUserByEmail: User;
  login: Scalars["String"]["output"];
};

export type QueryGetAdByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryGetAdsByUserArgs = {
  userId: Scalars["String"]["input"];
};

export type QueryGetAllAdsArgs = {
  limit?: Scalars["Int"]["input"];
  mangoAmountMax?: InputMaybe<Scalars["Int"]["input"]>;
  mangoAmountMin?: InputMaybe<Scalars["Int"]["input"]>;
  page?: Scalars["Int"]["input"];
  skillId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryGetChatsByUserIdArgs = {
  userId: Scalars["String"]["input"];
};

export type QueryGetMangoBalanceByUserIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryGetMessagesByChatIdArgs = {
  chatId: Scalars["String"]["input"];
};

export type QueryGetReviewsByUserHelperIdArgs = {
  userHelperId: Scalars["String"]["input"];
};

export type QueryGetTransactionsHistoryByUserArgs = {
  userId: Scalars["String"]["input"];
};

export type QueryGetUserByEmailArgs = {
  email: Scalars["String"]["input"];
};

export type QueryLoginArgs = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type Review = {
  __typename?: "Review";
  comment?: Maybe<Scalars["String"]["output"]>;
  date: Scalars["DateTimeISO"]["output"];
  id: Scalars["ID"]["output"];
  rating: Scalars["Float"]["output"];
  title: Scalars["String"]["output"];
  userHelper: User;
  userRequester: User;
};

export type ReviewInput = {
  comment?: InputMaybe<Scalars["String"]["input"]>;
  rating: Scalars["Float"]["input"];
  title: Scalars["String"]["input"];
  userHelperId: Scalars["String"]["input"];
  userRequesterId: Scalars["String"]["input"];
};

export type Skill = {
  __typename?: "Skill";
  ads: Ad;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  picture: Scalars["String"]["output"];
};

/** Statut de l'annonce */
export enum Status {
  Booked = "BOOKED",
  Finalised = "FINALISED",
  Posted = "POSTED",
}

export type Transaction = {
  __typename?: "Transaction";
  ad: Ad;
  date: Scalars["DateTimeISO"]["output"];
  id: Scalars["ID"]["output"];
  userHelper: User;
  userRequester: User;
};

export type TransactionInput = {
  adId: Scalars["String"]["input"];
  userHelperId: Scalars["String"]["input"];
  userRequesterId: Scalars["String"]["input"];
};

export type User = {
  __typename?: "User";
  address: Scalars["String"]["output"];
  ads: Array<Ad>;
  biography?: Maybe<Scalars["String"]["output"]>;
  chatsAsHelper: Array<Chat>;
  chatsAsRequester: Array<Chat>;
  city: Scalars["String"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  dateOfBirth?: Maybe<Scalars["DateTimeISO"]["output"]>;
  email: Scalars["String"]["output"];
  firstName: Scalars["String"]["output"];
  gender?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  lastName: Scalars["String"]["output"];
  mangoBalance: Scalars["Float"]["output"];
  messages: Array<Message>;
  password: Scalars["String"]["output"];
  picture?: Maybe<Scalars["String"]["output"]>;
  reviewsAsHelper: Array<Review>;
  reviewsAsRequester: Array<Review>;
  skills: Array<Skill>;
  transactionsAsHelper: Array<Transaction>;
  transactionsAsRequester: Array<Transaction>;
  zipCode: Scalars["String"]["output"];
};

export type GetAllAdsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllAdsQuery = {
  __typename?: "Query";
  getAllAds: Array<{
    __typename?: "Ad";
    id: string;
    title: string;
    updatedAt: any;
    mangoAmount: number;
    status: Status;
    skill: { __typename?: "Skill"; id: string; name: string; picture: string };
    userRequester: { __typename?: "User"; id: string; picture?: string | null };
  }>;
};

export type GetAllSkillsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllSkillsQuery = {
  __typename?: "Query";
  getAllSkills?: Array<{
    __typename?: "Skill";
    id: string;
    name: string;
    picture: string;
  }> | null;
};

export const GetAllAdsDocument = gql`
  query GetAllAds {
    getAllAds {
      id
      title
      updatedAt
      mangoAmount
      status
      skill {
        id
        name
        picture
      }
      userRequester {
        id
        picture
      }
    }
  }
`;

/**
 * __useGetAllAdsQuery__
 *
 * To run a query within a React component, call `useGetAllAdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllAdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllAdsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllAdsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetAllAdsQuery, GetAllAdsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAllAdsQuery, GetAllAdsQueryVariables>(
    GetAllAdsDocument,
    options
  );
}
export function useGetAllAdsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAllAdsQuery,
    GetAllAdsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAllAdsQuery, GetAllAdsQueryVariables>(
    GetAllAdsDocument,
    options
  );
}
export function useGetAllAdsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetAllAdsQuery, GetAllAdsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetAllAdsQuery, GetAllAdsQueryVariables>(
    GetAllAdsDocument,
    options
  );
}
export type GetAllAdsQueryHookResult = ReturnType<typeof useGetAllAdsQuery>;
export type GetAllAdsLazyQueryHookResult = ReturnType<
  typeof useGetAllAdsLazyQuery
>;
export type GetAllAdsSuspenseQueryHookResult = ReturnType<
  typeof useGetAllAdsSuspenseQuery
>;
export type GetAllAdsQueryResult = Apollo.QueryResult<
  GetAllAdsQuery,
  GetAllAdsQueryVariables
>;
export const GetAllSkillsDocument = gql`
  query GetAllSkills {
    getAllSkills {
      id
      name
      picture
    }
  }
`;

/**
 * __useGetAllSkillsQuery__
 *
 * To run a query within a React component, call `useGetAllSkillsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllSkillsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllSkillsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllSkillsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAllSkillsQuery,
    GetAllSkillsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAllSkillsQuery, GetAllSkillsQueryVariables>(
    GetAllSkillsDocument,
    options
  );
}
export function useGetAllSkillsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAllSkillsQuery,
    GetAllSkillsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAllSkillsQuery, GetAllSkillsQueryVariables>(
    GetAllSkillsDocument,
    options
  );
}
export function useGetAllSkillsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetAllSkillsQuery,
        GetAllSkillsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetAllSkillsQuery, GetAllSkillsQueryVariables>(
    GetAllSkillsDocument,
    options
  );
}
export type GetAllSkillsQueryHookResult = ReturnType<
  typeof useGetAllSkillsQuery
>;
export type GetAllSkillsLazyQueryHookResult = ReturnType<
  typeof useGetAllSkillsLazyQuery
>;
export type GetAllSkillsSuspenseQueryHookResult = ReturnType<
  typeof useGetAllSkillsSuspenseQuery
>;
export type GetAllSkillsQueryResult = Apollo.QueryResult<
  GetAllSkillsQuery,
  GetAllSkillsQueryVariables
>;
