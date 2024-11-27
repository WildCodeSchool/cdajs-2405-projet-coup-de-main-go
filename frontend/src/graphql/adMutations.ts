import { gql } from "@apollo/client";

export const CREATE_AD_MUTATION = gql`
  mutation CreateAd($formData: AdInput!) {
    createAd(adData: $formData) {
      id
    }
  }
`;
