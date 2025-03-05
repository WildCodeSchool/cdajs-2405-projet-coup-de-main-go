import { gql } from "@apollo/client";

export const GET_ALL_ADS_QUERY = gql`
  query GetAllAds(
    $skillId: String
    $mangoAmountMin: Int
    $mangoAmountMax: Int
    $durationMin: Int
    $durationMax: Int
    $page: Int
    $limit: Int
    $orderBy: String
    $status: Status
    $maxDistance: Float
    $userLatitude: Float
    $userLongitude: Float
  ) {
    getAllAds(
      skillId: $skillId
      mangoAmountMin: $mangoAmountMin
      mangoAmountMax: $mangoAmountMax
      durationMin: $durationMin
      durationMax: $durationMax
      page: $page
      limit: $limit
      orderBy: $orderBy
      status: $status
      maxDistance: $maxDistance
      userLatitude: $userLatitude
      userLongitude: $userLongitude
    ) {
      id
      title
      description
      updatedAt
      mangoAmount
      status
      picture1
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

// Get detailed information on ad and userRequester for AdDetail page
export const GET_AD_BY_ID_QUERY = gql`
  query GetAdById($id: String!) {
    getAdById(id: $id) {
      id
      title
      updatedAt
      mangoAmount
      description
      duration
      longitude
      latitude
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
        biography
      }
    }
  }
`;

// Get all ads for a specific user (ProfileAds)
export const GET_ADS_BY_USER_QUERY = gql`
  query GetAdsByUser($userId: String!) {
    getAdsByUser(userId: $userId) {
      id
      title
      description
      updatedAt
      mangoAmount
      status
      picture1
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
