import { gql } from "@apollo/client";

export const USER_REGISTER_MUTATION = gql`
    mutation RegisterUser(
        $email: String!
        $password: String!
        $firstName: String!
        $lastName: String!
        $address: String!
        $zipCode: String!
        $city: String!
        $skillsId: [String!]!
    ) {
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

export const USER_DELETE_MUTATION = gql`
    mutation DeleteUserAccount($id: String!) {
        deleteAccount(id: $id)
    }
`;

export const USER_CHANGE_PASSWORD_MUTATION = gql`
    mutation ChangeUserPassword($id: String!, $password: String!) {
        changePassword(id: $id, password: $password)
    }
`;

export const USER_UPDATE_MUTATION = gql`
    mutation UpdateUser(
        $id: String!
        $email: String
        $firstName: String
        $lastName: String
        $address: String
        $zipCode: String
        $city: String
        $biography: String
        $gender: String
        $dateOfBirth: DateTimeISO
        $picture: String
    ) {
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

export const USER_TRANSFER_MANGO_MUTATION = gql`
    mutation TransferMango($id: String!, $amount: Float!) {
        transferMango(id: $id, amount: $amount)
    }
`;

export const USER_LOGIN_QUERY = gql`
    query LoginUser($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            userId
        }
    }
`;

export const GET_ALL_USERS_QUERY = gql`
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

export const GET_USER_BY_EMAIL_QUERY = gql`
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

export const GET_MANGO_BALANCE_QUERY = gql`
    query GetMangoBalanceByUserId($id: String!) {
        getMangoBalanceByUserId(id: $id)
    }
`;

export const CREDENTIALS_VERIFICATION = gql`
    query credentialsVerification(
        $email: String!
        $password: String!
        $passwordConfirmation: String!
    ) {
        credentialsVerification(
            email: $email
            password: $password
            passwordConfirmation: $passwordConfirmation
        )
    }
`;
