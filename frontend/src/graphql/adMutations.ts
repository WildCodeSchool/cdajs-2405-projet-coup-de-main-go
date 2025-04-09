import { gql } from "@apollo/client";

export const UPDATE_AD_STATUS = gql`
  mutation UpdateAdStatus($id: String!, $status: String!) {
    updateAdStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const CREATE_AD = gql`
  mutation CreateAd($formData: AdInput!) {
    createAd(adData: $formData) {
      id
      title
    }
  }
`;

export const UPDATE_AD = gql`
  mutation UpdateAd($id: String!, $formData: AdUpdateInput!) {
    updateAd(id: $id, adData: $formData) {
      id
      title
    }
  }
`;

export const DELETE_AD = gql`
  mutation DeleteAd($id: String!, $userRequesterId: String!) {
    deleteAd(id: $id, userRequesterId: $userRequesterId)
  }
`;
