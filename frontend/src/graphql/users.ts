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
    mutation ChangeUserPassword(
        $email: String!
        $password: String!
        $passwordConfirmation: String!
    ) {
        changePassword(
            email: $email
            password: $password
            passwordConfirmation: $passwordConfirmation
        )
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
        $skillsId: [String!]
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
            skillsId: $skillsId
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

export const USERS_TRANSFER_MANGO_MUTATION = gql`
    mutation TransferBetweenUsers(
        $fromId: String!
        $toId: String!
        $amount: Float!
    ) {
        transferBetweenUsers(fromId: $fromId, toId: $toId, amount: $amount)
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
            otp
        }
    }
`;

export const GET_MANGO_BALANCE_QUERY = gql`
    query GetMangoBalanceByUserId($id: String!) {
        getMangoBalanceByUserId(id: $id)
    }
`;

export const UPDATE_PROFILE_PICTURE = gql`
    mutation UpdateProfilePicture($id: String!, $picture: String!) {
        updateProfilePicture(id: $id, picture: $picture) {
            id
            picture
        }
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

export const GET_USER_OVERVIEW_BY_ID = gql`
    query GetUserOverviewById($id: String!) {
        getUserOverviewById(id: $id) {
            user {
                firstName
                lastName
                picture
                biography
                mangoBalance
            }
            reviewsAsHelperCount
            averageRating
        }
    }
`;

export const SEND_EMAIL_VERIFICATION = gql`
    mutation SendEmailVerification($email: String!) {
        sendEmailVerification(email: $email)
    }
`;

export const VERIFY_OTP = gql`
    mutation VerifyOTP($email: String!, $otp: String!) {
        verifyOTP(email: $email, otp: $otp)
    }
`;
