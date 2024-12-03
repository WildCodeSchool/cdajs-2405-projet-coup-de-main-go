import { gql } from "@apollo/client";

export const GET_ALL_ADS_QUERY = gql`
  query GetAllAds {
    getAllAds {
      id
      title
      description
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

export const GET_AD_BY_ID_QUERY = gql`
  query GetAdById($id: String!) {
    getAdById(id: $id) {
      id
      title
      updatedAt
      mangoAmount
      status
      address
      zipCode
      city
      picture1
      picture2
      picture3
      skill {
        id
        name
      }
      userRequester {
        id
        firstName
        lastName
        picture
      }
    }
  }
`;
