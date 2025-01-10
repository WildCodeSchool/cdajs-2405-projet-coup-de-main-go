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
      description
      picture1
      picture2
      picture3
    }
  }
`;
