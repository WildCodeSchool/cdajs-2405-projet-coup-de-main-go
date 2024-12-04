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
  adId: Scalars['String']['input'];
  userHelperId: Scalars['String']['input'];
  userRequesterId: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  token: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type Message = {
  __typename?: 'Message';
  author: User;
  chat: Chat;
  date: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  isView: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type MessageInput = {
  authorId: Scalars['String']['input'];
  chatId: Scalars['String']['input'];
  isView: Scalars['Boolean']['input'];
  message: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addTransaction: Transaction;
  changePassword: Scalars['Boolean']['output'];
  createAd: Ad;
  createChat: Chat;
  createReview: Review;
  deleteAccount: Scalars['Boolean']['output'];
  deleteAd: Scalars['Boolean']['output'];
  register: User;
  sendMessage: Message;
  transferMango: Scalars['Float']['output'];
  updateAd: Ad;
  updateUser: User;
};


export type MutationAddTransactionArgs = {
  transactionData: TransactionInput;
};


export type MutationChangePasswordArgs = {
  id: Scalars['String']['input'];
  password: Scalars['String']['input'];
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
  id: Scalars['String']['input'];
};


export type MutationDeleteAdArgs = {
  id: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  skillsId: Array<Scalars['String']['input']>;
  zipCode: Scalars['String']['input'];
};


export type MutationSendMessageArgs = {
  messageData: MessageInput;
};


export type MutationTransferMangoArgs = {
  amount: Scalars['Float']['input'];
  id: Scalars['String']['input'];
};


export type MutationUpdateAdArgs = {
  adData: AdInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  biography?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTimeISO']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  picture?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  credentialsVerification: Scalars['Boolean']['output'];
  getAdById: Ad;
  getAdsByUser: Array<Ad>;
  getAllAds: Array<Ad>;
  getAllSkills?: Maybe<Array<Skill>>;
  getAllUsers: Array<User>;
  getChatsByUserId?: Maybe<Array<Chat>>;
  getMangoBalanceByUserId: Scalars['Float']['output'];
  getMessagesByChatId?: Maybe<Array<Message>>;
  getReviewsByUserHelperId?: Maybe<Array<Review>>;
  getTransactionsHistoryByUser?: Maybe<Array<Transaction>>;
  getUserByEmail: User;
  login: LoginResponse;
};


export type QueryCredentialsVerificationArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};


export type QueryGetAdByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetAdsByUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetAllAdsArgs = {
  limit?: Scalars['Int']['input'];
  mangoAmountMax?: InputMaybe<Scalars['Int']['input']>;
  mangoAmountMin?: InputMaybe<Scalars['Int']['input']>;
  page?: Scalars['Int']['input'];
  skillId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetChatsByUserIdArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetMangoBalanceByUserIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetMessagesByChatIdArgs = {
  chatId: Scalars['String']['input'];
};


export type QueryGetReviewsByUserHelperIdArgs = {
  userHelperId: Scalars['String']['input'];
};


export type QueryGetTransactionsHistoryByUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Review = {
  __typename?: 'Review';
  comment?: Maybe<Scalars['String']['output']>;
  date: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  rating: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  userHelper: User;
  userRequester: User;
};

export type ReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  rating: Scalars['Float']['input'];
  title: Scalars['String']['input'];
  userHelperId: Scalars['String']['input'];
  userRequesterId: Scalars['String']['input'];
};

export type Skill = {
  __typename?: 'Skill';
  ads: Ad;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  picture: Scalars['String']['output'];
};

/** Statut de l'annonce */
export enum Status {
  Booked = 'BOOKED',
  Finalised = 'FINALISED',
  Posted = 'POSTED'
}

export type Transaction = {
  __typename?: 'Transaction';
  ad: Ad;
  date: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  userHelper: User;
  userRequester: User;
};

export type TransactionInput = {
  adId: Scalars['String']['input'];
  userHelperId: Scalars['String']['input'];
  userRequesterId: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  address: Scalars['String']['output'];
  ads: Array<Ad>;
  biography?: Maybe<Scalars['String']['output']>;
  chatsAsHelper: Array<Chat>;
  chatsAsRequester: Array<Chat>;
  city: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  dateOfBirth?: Maybe<Scalars['DateTimeISO']['output']>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  mangoBalance: Scalars['Float']['output'];
  messages: Array<Message>;
  password: Scalars['String']['output'];
  picture?: Maybe<Scalars['String']['output']>;
  reviewsAsHelper: Array<Review>;
  reviewsAsRequester: Array<Review>;
  skills: Array<Skill>;
  transactionsAsHelper: Array<Transaction>;
  transactionsAsRequester: Array<Transaction>;
  zipCode: Scalars['String']['output'];
};

export type GetAllSkillsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSkillsQuery = { __typename?: 'Query', getAllSkills?: Array<{ __typename?: 'Skill', id: string, name: string, picture: string }> | null };

export type RegisterUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  address: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
  city: Scalars['String']['input'];
  skillsId: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', register: { __typename?: 'User', id: string, email: string } };

export type DeleteUserAccountMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteUserAccountMutation = { __typename?: 'Mutation', deleteAccount: boolean };

export type ChangeUserPasswordMutationVariables = Exact<{
  id: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type ChangeUserPasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  biography?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTimeISO']['input']>;
  picture?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string } };

export type TransferMangoMutationVariables = Exact<{
  id: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
}>;


export type TransferMangoMutation = { __typename?: 'Mutation', transferMango: number };

export type LoginUserQueryVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginUserQuery = { __typename?: 'Query', login: { __typename?: 'LoginResponse', token: string, userId: string } };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers: Array<{ __typename?: 'User', id: string, email: string, firstName: string, lastName: string, city: string, skills: Array<{ __typename?: 'Skill', id: string, name: string }> }> };

export type GetUserByEmailQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type GetUserByEmailQuery = { __typename?: 'Query', getUserByEmail: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, city: string, skills: Array<{ __typename?: 'Skill', id: string, name: string }> } };

export type GetMangoBalanceByUserIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetMangoBalanceByUserIdQuery = { __typename?: 'Query', getMangoBalanceByUserId: number };

export type CredentialsVerificationQueryVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
}>;


export type CredentialsVerificationQuery = { __typename?: 'Query', credentialsVerification: boolean };


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
export function useGetAllSkillsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllSkillsQuery, GetAllSkillsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllSkillsQuery, GetAllSkillsQueryVariables>(GetAllSkillsDocument, options);
      }
export function useGetAllSkillsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllSkillsQuery, GetAllSkillsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllSkillsQuery, GetAllSkillsQueryVariables>(GetAllSkillsDocument, options);
        }
export function useGetAllSkillsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllSkillsQuery, GetAllSkillsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllSkillsQuery, GetAllSkillsQueryVariables>(GetAllSkillsDocument, options);
        }
export type GetAllSkillsQueryHookResult = ReturnType<typeof useGetAllSkillsQuery>;
export type GetAllSkillsLazyQueryHookResult = ReturnType<typeof useGetAllSkillsLazyQuery>;
export type GetAllSkillsSuspenseQueryHookResult = ReturnType<typeof useGetAllSkillsSuspenseQuery>;
export type GetAllSkillsQueryResult = Apollo.QueryResult<GetAllSkillsQuery, GetAllSkillsQueryVariables>;
export const RegisterUserDocument = gql`
    mutation RegisterUser($email: String!, $password: String!, $firstName: String!, $lastName: String!, $address: String!, $zipCode: String!, $city: String!, $skillsId: [String!]!) {
  register(
    email: $email
    password: $password
    firstName: $firstName
    lastName: $lastName
    address: $address
    zipCode: $zipCode
    city: $city
    skillsId: $skillsId
  ) {
    id
    email
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      address: // value for 'address'
 *      zipCode: // value for 'zipCode'
 *      city: // value for 'city'
 *      skillsId: // value for 'skillsId'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const DeleteUserAccountDocument = gql`
    mutation DeleteUserAccount($id: String!) {
  deleteAccount(id: $id)
}
    `;
export type DeleteUserAccountMutationFn = Apollo.MutationFunction<DeleteUserAccountMutation, DeleteUserAccountMutationVariables>;

/**
 * __useDeleteUserAccountMutation__
 *
 * To run a mutation, you first call `useDeleteUserAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserAccountMutation, { data, loading, error }] = useDeleteUserAccountMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserAccountMutation, DeleteUserAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserAccountMutation, DeleteUserAccountMutationVariables>(DeleteUserAccountDocument, options);
      }
export type DeleteUserAccountMutationHookResult = ReturnType<typeof useDeleteUserAccountMutation>;
export type DeleteUserAccountMutationResult = Apollo.MutationResult<DeleteUserAccountMutation>;
export type DeleteUserAccountMutationOptions = Apollo.BaseMutationOptions<DeleteUserAccountMutation, DeleteUserAccountMutationVariables>;
export const ChangeUserPasswordDocument = gql`
    mutation ChangeUserPassword($id: String!, $password: String!) {
  changePassword(id: $id, password: $password)
}
    `;
export type ChangeUserPasswordMutationFn = Apollo.MutationFunction<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>;

/**
 * __useChangeUserPasswordMutation__
 *
 * To run a mutation, you first call `useChangeUserPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeUserPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeUserPasswordMutation, { data, loading, error }] = useChangeUserPasswordMutation({
 *   variables: {
 *      id: // value for 'id'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useChangeUserPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>(ChangeUserPasswordDocument, options);
      }
export type ChangeUserPasswordMutationHookResult = ReturnType<typeof useChangeUserPasswordMutation>;
export type ChangeUserPasswordMutationResult = Apollo.MutationResult<ChangeUserPasswordMutation>;
export type ChangeUserPasswordMutationOptions = Apollo.BaseMutationOptions<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($id: String!, $email: String, $firstName: String, $lastName: String, $address: String, $zipCode: String, $city: String, $biography: String, $gender: String, $dateOfBirth: DateTimeISO, $picture: String) {
  updateUser(
    id: $id
    email: $email
    firstName: $firstName
    lastName: $lastName
    address: $address
    zipCode: $zipCode
    city: $city
    biography: $biography
    gender: $gender
    dateOfBirth: $dateOfBirth
    picture: $picture
  ) {
    id
    email
    firstName
    lastName
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *      email: // value for 'email'
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      address: // value for 'address'
 *      zipCode: // value for 'zipCode'
 *      city: // value for 'city'
 *      biography: // value for 'biography'
 *      gender: // value for 'gender'
 *      dateOfBirth: // value for 'dateOfBirth'
 *      picture: // value for 'picture'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const TransferMangoDocument = gql`
    mutation TransferMango($id: String!, $amount: Float!) {
  transferMango(id: $id, amount: $amount)
}
    `;
export type TransferMangoMutationFn = Apollo.MutationFunction<TransferMangoMutation, TransferMangoMutationVariables>;

/**
 * __useTransferMangoMutation__
 *
 * To run a mutation, you first call `useTransferMangoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTransferMangoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [transferMangoMutation, { data, loading, error }] = useTransferMangoMutation({
 *   variables: {
 *      id: // value for 'id'
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useTransferMangoMutation(baseOptions?: Apollo.MutationHookOptions<TransferMangoMutation, TransferMangoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TransferMangoMutation, TransferMangoMutationVariables>(TransferMangoDocument, options);
      }
export type TransferMangoMutationHookResult = ReturnType<typeof useTransferMangoMutation>;
export type TransferMangoMutationResult = Apollo.MutationResult<TransferMangoMutation>;
export type TransferMangoMutationOptions = Apollo.BaseMutationOptions<TransferMangoMutation, TransferMangoMutationVariables>;
export const LoginUserDocument = gql`
    query LoginUser($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    userId
  }
}
    `;

/**
 * __useLoginUserQuery__
 *
 * To run a query within a React component, call `useLoginUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginUserQuery({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginUserQuery(baseOptions: Apollo.QueryHookOptions<LoginUserQuery, LoginUserQueryVariables> & ({ variables: LoginUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LoginUserQuery, LoginUserQueryVariables>(LoginUserDocument, options);
      }
export function useLoginUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoginUserQuery, LoginUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LoginUserQuery, LoginUserQueryVariables>(LoginUserDocument, options);
        }
export function useLoginUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LoginUserQuery, LoginUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LoginUserQuery, LoginUserQueryVariables>(LoginUserDocument, options);
        }
export type LoginUserQueryHookResult = ReturnType<typeof useLoginUserQuery>;
export type LoginUserLazyQueryHookResult = ReturnType<typeof useLoginUserLazyQuery>;
export type LoginUserSuspenseQueryHookResult = ReturnType<typeof useLoginUserSuspenseQuery>;
export type LoginUserQueryResult = Apollo.QueryResult<LoginUserQuery, LoginUserQueryVariables>;
export const GetAllUsersDocument = gql`
    query GetAllUsers {
  getAllUsers {
    id
    email
    firstName
    lastName
    city
    skills {
      id
      name
    }
  }
}
    `;

/**
 * __useGetAllUsersQuery__
 *
 * To run a query within a React component, call `useGetAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
      }
export function useGetAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export function useGetAllUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export type GetAllUsersQueryHookResult = ReturnType<typeof useGetAllUsersQuery>;
export type GetAllUsersLazyQueryHookResult = ReturnType<typeof useGetAllUsersLazyQuery>;
export type GetAllUsersSuspenseQueryHookResult = ReturnType<typeof useGetAllUsersSuspenseQuery>;
export type GetAllUsersQueryResult = Apollo.QueryResult<GetAllUsersQuery, GetAllUsersQueryVariables>;
export const GetUserByEmailDocument = gql`
    query GetUserByEmail($email: String!) {
  getUserByEmail(email: $email) {
    id
    email
    firstName
    lastName
    city
    skills {
      id
      name
    }
  }
}
    `;

/**
 * __useGetUserByEmailQuery__
 *
 * To run a query within a React component, call `useGetUserByEmailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByEmailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByEmailQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useGetUserByEmailQuery(baseOptions: Apollo.QueryHookOptions<GetUserByEmailQuery, GetUserByEmailQueryVariables> & ({ variables: GetUserByEmailQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserByEmailQuery, GetUserByEmailQueryVariables>(GetUserByEmailDocument, options);
      }
export function useGetUserByEmailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserByEmailQuery, GetUserByEmailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserByEmailQuery, GetUserByEmailQueryVariables>(GetUserByEmailDocument, options);
        }
export function useGetUserByEmailSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserByEmailQuery, GetUserByEmailQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserByEmailQuery, GetUserByEmailQueryVariables>(GetUserByEmailDocument, options);
        }
export type GetUserByEmailQueryHookResult = ReturnType<typeof useGetUserByEmailQuery>;
export type GetUserByEmailLazyQueryHookResult = ReturnType<typeof useGetUserByEmailLazyQuery>;
export type GetUserByEmailSuspenseQueryHookResult = ReturnType<typeof useGetUserByEmailSuspenseQuery>;
export type GetUserByEmailQueryResult = Apollo.QueryResult<GetUserByEmailQuery, GetUserByEmailQueryVariables>;
export const GetMangoBalanceByUserIdDocument = gql`
    query GetMangoBalanceByUserId($id: String!) {
  getMangoBalanceByUserId(id: $id)
}
    `;

/**
 * __useGetMangoBalanceByUserIdQuery__
 *
 * To run a query within a React component, call `useGetMangoBalanceByUserIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMangoBalanceByUserIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMangoBalanceByUserIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMangoBalanceByUserIdQuery(baseOptions: Apollo.QueryHookOptions<GetMangoBalanceByUserIdQuery, GetMangoBalanceByUserIdQueryVariables> & ({ variables: GetMangoBalanceByUserIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMangoBalanceByUserIdQuery, GetMangoBalanceByUserIdQueryVariables>(GetMangoBalanceByUserIdDocument, options);
      }
export function useGetMangoBalanceByUserIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMangoBalanceByUserIdQuery, GetMangoBalanceByUserIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMangoBalanceByUserIdQuery, GetMangoBalanceByUserIdQueryVariables>(GetMangoBalanceByUserIdDocument, options);
        }
export function useGetMangoBalanceByUserIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMangoBalanceByUserIdQuery, GetMangoBalanceByUserIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMangoBalanceByUserIdQuery, GetMangoBalanceByUserIdQueryVariables>(GetMangoBalanceByUserIdDocument, options);
        }
export type GetMangoBalanceByUserIdQueryHookResult = ReturnType<typeof useGetMangoBalanceByUserIdQuery>;
export type GetMangoBalanceByUserIdLazyQueryHookResult = ReturnType<typeof useGetMangoBalanceByUserIdLazyQuery>;
export type GetMangoBalanceByUserIdSuspenseQueryHookResult = ReturnType<typeof useGetMangoBalanceByUserIdSuspenseQuery>;
export type GetMangoBalanceByUserIdQueryResult = Apollo.QueryResult<GetMangoBalanceByUserIdQuery, GetMangoBalanceByUserIdQueryVariables>;
export const CredentialsVerificationDocument = gql`
    query credentialsVerification($email: String!, $password: String!, $passwordConfirmation: String!) {
  credentialsVerification(
    email: $email
    password: $password
    passwordConfirmation: $passwordConfirmation
  )
}
    `;

/**
 * __useCredentialsVerificationQuery__
 *
 * To run a query within a React component, call `useCredentialsVerificationQuery` and pass it any options that fit your needs.
 * When your component renders, `useCredentialsVerificationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCredentialsVerificationQuery({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      passwordConfirmation: // value for 'passwordConfirmation'
 *   },
 * });
 */
export function useCredentialsVerificationQuery(baseOptions: Apollo.QueryHookOptions<CredentialsVerificationQuery, CredentialsVerificationQueryVariables> & ({ variables: CredentialsVerificationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CredentialsVerificationQuery, CredentialsVerificationQueryVariables>(CredentialsVerificationDocument, options);
      }
export function useCredentialsVerificationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CredentialsVerificationQuery, CredentialsVerificationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CredentialsVerificationQuery, CredentialsVerificationQueryVariables>(CredentialsVerificationDocument, options);
        }
export function useCredentialsVerificationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CredentialsVerificationQuery, CredentialsVerificationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CredentialsVerificationQuery, CredentialsVerificationQueryVariables>(CredentialsVerificationDocument, options);
        }
export type CredentialsVerificationQueryHookResult = ReturnType<typeof useCredentialsVerificationQuery>;
export type CredentialsVerificationLazyQueryHookResult = ReturnType<typeof useCredentialsVerificationLazyQuery>;
export type CredentialsVerificationSuspenseQueryHookResult = ReturnType<typeof useCredentialsVerificationSuspenseQuery>;
export type CredentialsVerificationQueryResult = Apollo.QueryResult<CredentialsVerificationQuery, CredentialsVerificationQueryVariables>;